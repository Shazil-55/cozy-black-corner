
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
        <div className="relative">
          <div className="absolute inset-0 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
          <Loader2 className="h-8 w-8 text-white animate-spin relative z-10" />
        </div>
        <p className="text-sm font-medium text-gray-700 ml-3">{message}</p>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn("w-full flex flex-col items-center justify-center py-8", className)}>
        <div className="relative w-20 h-20 mb-6">
          {/* Animated background circles */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 animate-ping"></div>
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className="text-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="url(#gradient)"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-xl text-gray-800">{message}</h3>
          <p className="text-sm text-gray-600 animate-pulse">
            {statusMessage || steps[currentStep]}
          </p>
          {!isIndeterminate && (
            <p className="text-xs font-medium text-blue-600">
              {Math.round(progress)}% complete
            </p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full flex flex-col items-center py-12", className)}>
      <div className="relative w-32 h-32 mb-8">
        {/* Multiple animated rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 animate-ping"></div>
        <div className="absolute inset-8 rounded-full bg-white shadow-lg"></div>
        
        {/* Main progress circle */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="46"
            cx="50"
            cy="50"
          />
          <circle
            className="transition-all duration-500"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="url(#mainGradient)"
            fill="transparent"
            r="46"
            cx="50"
            cy="50"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
          />
          <defs>
            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3 max-w-sm">
        <h2 className="font-bold text-2xl text-gray-800">{message}</h2>
        <p className="text-gray-600 animate-fade-in">
          {statusMessage || steps[currentStep]}
        </p>
        
        {!isIndeterminate && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
