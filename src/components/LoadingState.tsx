
import React from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  progress?: number;
  isIndeterminate?: boolean;
  className?: string;
  statusMessage?: string;
}

export const LoadingState = ({
  message = "Generating syllabus...",
  progress = 0,
  isIndeterminate = false,
  className,
  statusMessage,
}: LoadingStateProps) => {
  const steps = [
    "Analyzing document structure...",
    "Extracting key topics and concepts...",
    "Organizing content into logical modules...",
    "Creating detailed lesson plans...",
    "Finalizing syllabus structure..."
  ];
  
  const currentStep = Math.min(
    Math.floor((progress / 100) * steps.length),
    steps.length - 1
  );
  
  return (
    <div className={cn("w-full flex flex-col items-center py-12", className)}>
      <div className="relative w-28 h-28 mb-8">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-talentlms-lightBlue/30" />
        
        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className={cn(
              "text-talentlms-blue transition-all duration-500",
              isIndeterminate && "animate-pulse-soft"
            )}
            strokeWidth="6"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: 2 * Math.PI * 45,
              strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100)
            }}
          />
        </svg>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-talentlms-blue" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-1 max-w-md">
        <h3 className="font-medium text-xl text-talentlms-darkBlue">{message}</h3>
        <p className="text-muted-foreground animate-fade-in">
          {statusMessage || steps[currentStep]}
        </p>
      </div>
      
      <div className="w-full max-w-md mt-8">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r from-talentlms-blue to-talentlms-blue/70 rounded-full transition-all duration-300",
              isIndeterminate && "animate-shimmer bg-shimmer bg-[length:400%_100%]"
            )}
            style={{ width: isIndeterminate ? '100%' : `${progress}%` }}
          />
        </div>
        
        {!isIndeterminate && (
          <div className="mt-2 text-right">
            <span className="text-xs font-medium text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
