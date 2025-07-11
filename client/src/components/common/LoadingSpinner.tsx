import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            'absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent',
            sizeClasses[size]
          )}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};