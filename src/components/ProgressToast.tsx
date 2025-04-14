
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressStatus } from '@/hooks/useSocketProgress';

interface ProgressToastProps {
  progress: number;
  status: ProgressStatus;
  message: string;
}

export const ProgressToast = ({ progress, status, message }: ProgressToastProps) => {
  return (
    <div className="w-full bg-card shadow-md rounded-lg overflow-hidden border border-border border-l-4 border-l-blue-500 dark:border-l-blue-400">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {status === 'completed' ? (
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            ) : status === 'error' ? (
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className={cn(
                "text-sm font-medium",
                status === 'completed' ? "text-green-600 dark:text-green-400" : 
                status === 'error' ? "text-red-600 dark:text-red-400" : 
                "text-blue-600 dark:text-blue-400"
              )}>
                {status === 'completed' ? 'Processing Complete' : 
                 status === 'error' ? 'Processing Failed' : 
                 'Processing in Progress'}
              </h3>
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground truncate">
              {message}
            </p>
            <div className="mt-2">
              <Progress 
                value={progress} 
                className={cn(
                  "h-2",
                  status === 'completed' ? "bg-green-100 dark:bg-green-900/30" : 
                  status === 'error' ? "bg-red-100 dark:bg-red-900/30" : 
                  "bg-blue-100 dark:bg-blue-900/30"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
