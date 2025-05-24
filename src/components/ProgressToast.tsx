
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressStatus } from '@/hooks/useSocketProgress';
import { Button } from '@/components/ui/button';

interface ProgressToastProps {
  progress: number;
  status: ProgressStatus;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const ProgressToast = ({ 
  progress, 
  status, 
  message, 
  onClose,
  autoClose = true,
  duration = 5000
}: ProgressToastProps) => {
  // Auto close after duration if autoClose is true
  React.useEffect(() => {
    if (autoClose && onClose && (status === 'completed' || status === 'error')) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, status, duration]);

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
              <div className="flex items-center">
                <span className="text-xs font-medium text-muted-foreground mr-2">
                  {Math.round(progress)}%
                </span>
                {onClose && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="h-5 w-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
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
