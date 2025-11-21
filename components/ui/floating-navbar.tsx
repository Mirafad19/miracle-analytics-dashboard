
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { useTheme } from "../../ThemeContext";
import { Sun, Moon } from "../Icons";
import { Logo, LogoIcon } from "../Branding";

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
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    
    if (elem) {
      const navHeight = 80; 
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
        // UNIFIED HEADER CONTAINER
        // Absolute positioning ensures it sits on top of the hero background
        "absolute top-0 left-0 w-full z-50",
        "flex items-center justify-between",
        "p-4 sm:p-6",
        className
      )}
    >
      {/* LEFT: BRANDING */}
      <div className="flex-shrink-0">
        {/* Mobile: Icon Only (Prevents overlap) */}
        <div className="block sm:hidden">
            <LogoIcon className="h-10 w-10 text-white" />
        </div>
        {/* Desktop: Full Logo */}
        <div className="hidden sm:block">
            <Logo textClassName="text-white" iconClassName="text-white" />
        </div>
      </div>

      {/* CENTER: NAVIGATION LINKS (Desktop Only) */}
      <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navItems.map((navItem: any, idx: number) => (
          <a
              key={`link=${idx}`}
              href={navItem.link}
              onClick={(e) => handleScroll(e, navItem.link)}
              className={cn(
              "text-indigo-100 hover:text-white",
              "text-sm font-medium transition-colors duration-200 cursor-pointer tracking-wide",
              )}
              title={navItem.name}
          >
              {navItem.name}
          </a>
          ))}
      </div>

      {/* RIGHT: ACTIONS (Theme + Sign In) */}
      <div className="flex items-center gap-3">
          {/* Theme Toggle - Subtle Glass */}
          <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-10 w-10 bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Sign In Button - High Contrast Pill */}
          <Button 
              variant="default" 
              size="sm" 
              onClick={onLoginClick} 
              className={cn(
              "rounded-full bg-white text-purple-700 hover:bg-indigo-50 border-none shadow-xl",
              "px-6 h-10 text-sm font-bold tracking-wide"
              )}
          >
            Sign In
          </Button>
      </div>
    </div>
  );
};
