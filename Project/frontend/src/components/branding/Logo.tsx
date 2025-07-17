import React from 'react';
// import { ChefHat } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <div className={clsx('flex items-center', className)} {...props}>
      <div>
        <img src="https://png.pngtree.com/png-vector/20220606/ourmid/pngtree-cooking-pan-with-vegetables-png-image_4867565.png"  alt="DineDash Logo" 
          className="h-24 w-24 pb-4 object-contain"
        />
      </div>
      <span className=" text-2xl font-bold text-gray-900 pt-4">DineDash</span>
    </div>
  );
};
