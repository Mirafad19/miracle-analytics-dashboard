
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
        // Base positioning and styling
        "fixed top-4 left-1/2 -translate-x-1/2 z-[9999]",
        "border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-xl rounded-full",
        // Mobile-first sizing and layout
        "w-[92%] flex items-center justify-between px-2 py-2",
        // Desktop overrides: auto width, tighter padding, specific spacing
        "sm:w-auto sm:max-w-fit sm:px-4 sm:py-2",
        className
      )}
    >
      {/* Nav Items Container */}
      <div className="flex flex-1 items-center justify-around sm:justify-start sm:gap-1 sm:flex-none">
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
              // Mobile: larger touch target, icon only, evenly distributed
              "p-2.5",
              // Desktop: text visible, standard padding
              "sm:px-3 sm:py-2"
            )}
            title={navItem.name}
          >
            {/* Icon: Visible on mobile, hidden on small desktop unless specified otherwise */}
            <span className="block sm:hidden">
                {React.isValidElement(navItem.icon) 
                    ? React.cloneElement(navItem.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })
                    : navItem.icon}
            </span>
            
            {/* Text: Hidden on mobile, visible on desktop */}
            <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
          </a>
        ))}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 ml-1 sm:ml-2">
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
              // Mobile: compact padding and height
              "px-4 h-9 text-xs",
              // Desktop: standard padding
              "sm:px-6 sm:text-sm"
            )}
        >
          <span className="font-semibold">Sign In</span>
        </Button>
      </div>
    </div>
  );
};
