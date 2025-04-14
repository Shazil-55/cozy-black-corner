
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className 
}: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-blue-500 dark:text-blue-400',
    secondary: 'text-gray-500 dark:text-gray-400',
    muted: 'text-gray-400 dark:text-gray-600'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin', 
        sizeClasses[size], 
        colorClasses[color],
        className
      )} 
    />
  );
};
