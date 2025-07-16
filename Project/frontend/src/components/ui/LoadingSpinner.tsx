import React from 'react';
import clsx from 'clsx'; // Optional: You can use clsx to conditionally join class names easily

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  return (
    <div
      className={clsx(
        'inline-block animate-spin rounded-full border-t-transparent border-solid',
        sizeMap[size],
        'border-orange-500', // Color of spinner
        className
      )}
    />
  );
};

export default LoadingSpinner;
