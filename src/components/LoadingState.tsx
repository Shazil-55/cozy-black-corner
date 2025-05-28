
import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingStateProps {
  message?: string;
  progress?: number;
  isIndeterminate?: boolean;
  className?: string;
  statusMessage?: string;
  variant?: 'default' | 'spinner' | 'minimal';
}

export const LoadingState = ({
  message = "Loading...",
  progress = 0,
  isIndeterminate = false,
  className,
  statusMessage,
  variant = 'default',
}: LoadingStateProps) => {
  const steps = [
    "Preparing resources...",
    "Connecting to server...",
    "Loading your content...",
    "Finalizing setup...",
    "Almost there..."
  ];
  
  const currentStep = Math.min(
    Math.floor((progress / 100) * steps.length),
    steps.length - 1
  );

  if (variant === 'minimal') {
    return (
      <div className={cn("w-full flex items-center justify-center py-4", className)}>
        <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn("w-full flex flex-col items-center justify-center py-6", className)}>
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-500 transition-all duration-500"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>
        </div>
        <p className="text-base font-medium text-gray-800 dark:text-gray-200">{message}</p>
        {statusMessage && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{statusMessage}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn("w-full flex flex-col items-center py-10", className)}>
      <div className="relative w-24 h-24 mb-6">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
        
        {/* Background circle with subtle pattern */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100/50 to-white dark:from-blue-900/20 dark:to-gray-800/50"></div>
        
        {/* Multiple circles for layered effect */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="46"
            cx="50"
            cy="50"
          />
          
          {/* Secondary progress - thinner, decorative */}
          <circle
            className="text-blue-300 dark:text-blue-600"
            strokeWidth="2"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={2 * Math.PI * 42 * (1 - (progress + 10) / 100)}
          />
          
          {/* Main progress track */}
          <circle
            className={cn(
              "text-blue-500 transition-all duration-500",
              isIndeterminate && "animate-pulse"
            )}
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="46"
            cx="50"
            cy="50"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
          />
          
          {/* Animated dots along track */}
          {isIndeterminate && [...Array(6)].map((_, i) => (
            <circle 
              key={i} 
              className="text-blue-600 animate-bounce" 
              r="2"
              cx="50"
              cy="4"
              fill="currentColor"
              transform={`rotate(${60 * i} 50 50) translate(0 -46)`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </svg>
        
        {/* Center icon with animated background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/30 shadow-md flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 dark:via-blue-400/10 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
            <Sparkles className="w-6 h-6 text-blue-500 dark:text-blue-400 relative z-10" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-1 max-w-xs">
        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{message}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          {statusMessage || steps[currentStep]}
        </p>
      </div>
      
      <div className="w-full max-w-xs mt-6">
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isIndeterminate 
                ? "animate-shimmer bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 bg-[length:200%_100%]" 
                : "bg-blue-500"
            )}
            style={{ width: isIndeterminate ? '100%' : `${progress}%` }}
          />
        </div>
        
        {!isIndeterminate && (
          <div className="mt-1.5 text-right">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
