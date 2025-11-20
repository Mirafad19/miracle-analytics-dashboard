
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

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

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 flex max-w-fit border border-zinc-200 dark:border-zinc-800 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-xl z-[9999] pr-2 pl-6 py-2 items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem: any, idx: number) => (
        <a
          key={`link=${idx}`}
          href={navItem.link}
          onClick={(e) => handleScroll(e, navItem.link)}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-2 rounded-full transition-colors duration-200 cursor-pointer"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
        </a>
      ))}
      <Button 
          variant="default" 
          size="sm" 
          onClick={onLoginClick} 
          className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none shadow-md"
      >
        <span className="font-semibold">Sign In</span>
      </Button>
    </div>
  );
};
