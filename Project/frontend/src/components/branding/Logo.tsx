import React from 'react';
import { ChefHat } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <div className={clsx('flex items-center', className)} {...props}>
      <div className="bg-gradient-to-r from-orange-500 to-green-500 p-2 rounded-lg">
        <ChefHat className="h-8 w-8 text-white" />
      </div>
      <span className="ml-2 text-2xl font-bold text-gray-900">DineDash</span>
    </div>
  );
};
