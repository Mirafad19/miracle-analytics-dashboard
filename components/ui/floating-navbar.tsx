
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { useTheme } from "../../ThemeContext";
import { Sun, Moon } from "../Icons";

export const FloatingNav = ({
  navItems,
  className,
  onLoginClick,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  onLoginClick: () => void;
}) => {
  const { theme, setTheme } = useTheme();
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Remove the hash to get the ID
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    
    if (elem) {
      // Calculate position with offset for the navbar
      const navHeight = 80; // Approximate height of navbar + spacing
      const elementPosition = elem.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={cn(
        // Base positioning: Fixed, High Z-Index, Rounded Pill
        "fixed z-[9999] rounded-full",
        "border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-xl",
        
        // MOBILE LAYOUT (Default):
        // Positioned Top-Right to avoid covering the Logo (Top-Left)
        // Compact sizing
        "top-4 right-4 p-1.5 pl-3",

        // DESKTOP LAYOUT (sm:):
        // Positioned Top-Center
        // Full sizing with nav items
        "sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:p-2 sm:px-4",
        
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Nav Items Container - HIDDEN ON MOBILE, Visible on Desktop */}
        <div className="hidden sm:flex items-center gap-1 mr-2">
            {navItems.map((navItem: any, idx: number) => (
            <a
                key={`link=${idx}`}
                href={navItem.link}
                onClick={(e) => handleScroll(e, navItem.link)}
                className={cn(
                "relative flex items-center justify-center",
                "text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-300 hover:text-neutral-500",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "rounded-full transition-colors duration-200 cursor-pointer",
                "px-3 py-2"
                )}
                title={navItem.name}
            >
                <span className="text-sm font-medium">{navItem.name}</span>
            </a>
            ))}
            
            {/* Vertical Divider (Desktop Only) */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
        </div>

        {/* Actions (Theme + Sign In) - Always Visible */}
        <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-9 w-9 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Sign In Button */}
            <Button 
                variant="default" 
                size="sm" 
                onClick={onLoginClick} 
                className={cn(
                "rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none shadow-md flex-shrink-0",
                "px-4 h-9 text-xs sm:text-sm sm:px-6"
                )}
            >
            <span className="font-semibold">Sign In</span>
            </Button>
        </div>
      </div>
    </div>
  );
};
