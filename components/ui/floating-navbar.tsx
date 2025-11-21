
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
        // Layout Container: ABSOLUTE (Scrolls with page), High Z-Index, Flex
        // Changed from 'fixed' to 'absolute' to prevents overlap on scroll
        "absolute z-[50] flex items-center gap-2 sm:gap-3",
        
        // MOBILE POSITIONING: Top-Right
        // Allows the Brand Logo (Top-Left) to remain visible
        "top-4 right-4",

        // DESKTOP POSITIONING: Top-Center
        "sm:top-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto",
        
        className
      )}
    >
      {/* 
        DESKTOP ONLY: Navigation Links
        Simple text, no pill/border/background
      */}
      <div className="hidden sm:flex items-center gap-6 mr-4">
          {navItems.map((navItem: any, idx: number) => (
          <a
              key={`link=${idx}`}
              href={navItem.link}
              onClick={(e) => handleScroll(e, navItem.link)}
              className={cn(
              "relative flex items-center justify-center",
              "text-neutral-200 hover:text-white", // Light text for dark hero bg
              "text-sm font-medium transition-colors duration-200 cursor-pointer",
              )}
              title={navItem.name}
          >
              <span>{navItem.name}</span>
          </a>
          ))}
      </div>

      {/* 
        ACTIONS: Theme Toggle & Sign In 
        These now float independently with their own styling
      */}
      
      {/* Theme Toggle - Glass Bubble to match Hero Section */}
      <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full h-10 w-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-white hover:bg-white/20"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      {/* Sign In Button - Gradient Pill */}
      <Button 
          variant="default" 
          size="sm" 
          onClick={onLoginClick} 
          className={cn(
          "rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none shadow-lg flex-shrink-0",
          "px-5 h-10 text-sm font-semibold"
          )}
      >
        Sign In
      </Button>
    </div>
  );
};
