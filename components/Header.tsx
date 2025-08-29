import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-card/80 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-brand-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <svg
              className="h-8 w-auto text-brand-light"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="ml-3 text-2xl font-bold text-brand-light tracking-tight">
              AI Virtual Stylist
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};