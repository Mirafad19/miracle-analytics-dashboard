
import React from 'react';
import { cn } from '../lib/utils';

const HeadGearsLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head Profile Outline - Side View */}
    <path d="M13 22H9c-1.1 0-2-.9-2-2v-1.5c0-.8-.5-1.6-1.2-2C4 15.4 3 13.5 3 11.5 3 7.4 6.4 4 10.5 4c3.5 0 6.4 2.5 7.2 5.8.3 1.2.9 2.3 1.8 3.1.8.8 1.3 1.8 1.5 3 .3 2-1.2 3.8-3.2 4h-.8" />
    
    {/* Gear 1 (Top) */}
    <circle cx="10.5" cy="9.5" r="2" />
    <path d="M10.5 7v.5m0 4v.5m-2.5-2.5h.5m4 0h.5" />
    
    {/* Gear 2 (Right) */}
    <circle cx="15" cy="13" r="1.5" />
    <path d="M15 11v.5m0 3v.5m-2-2h.5m3 0h.5" />
    
    {/* Gear 3 (Bottom Left) */}
    <circle cx="9" cy="14" r="1.5" />
    <path d="M9 12v.5m0 3v.5m-2-2h.5m3 0h.5" />
  </svg>
);

interface LogoProps {
    className?: string;
    textClassName?: string;
    iconClassName?: string;
}

export const Logo = ({ className, textClassName, iconClassName }: LogoProps) => {
    return (
      <a href="#" className={cn("flex items-center gap-3 relative z-20 group", className)}>
        <HeadGearsLogo className={cn("h-10 w-10 text-black dark:text-white transition-colors", iconClassName)} />
        <span className={cn("font-bold text-black dark:text-white text-lg sm:text-xl tracking-[0.15em] uppercase transition-colors", textClassName)}>
          Miracle Analytics
        </span>
      </a>
    );
};
  
export const LogoIcon = ({ className }: { className?: string }) => {
    return (
      <a href="#" className={cn("flex items-center justify-center relative z-20", className)}>
        <HeadGearsLogo className="h-8 w-8 text-black dark:text-white" />
      </a>
    );
};
