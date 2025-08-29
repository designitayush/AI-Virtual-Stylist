import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  tooltip: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, tooltip, className, ...props }) => {
  return (
    <div className="relative group flex items-center">
      <button
        {...props}
        className={`bg-brand-card/80 backdrop-blur-sm text-brand-light p-2 rounded-full hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-action-hover transition-all duration-200 ${className}`}
      >
        {children}
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-brand-light text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
};