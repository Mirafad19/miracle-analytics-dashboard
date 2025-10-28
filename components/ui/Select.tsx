import React, { useState, useRef, useEffect, createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from '../Icons';

interface SelectContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const SelectContext = createContext<SelectContextType | null>(null);

// FIX: Refactored props from an inline type to a named interface to improve type checking reliability.
interface SelectProps {
  // FIX: Made 'children' prop optional to fix an issue where TypeScript incorrectly reported it as missing.
  children?: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

export const Select = ({ children, value, onValueChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  
  const contextValue = {
    isOpen,
    setIsOpen,
    selectedValue: value,
    setSelectedValue: onValueChange,
    selectedLabel,
    setSelectedLabel,
    triggerRef,
  };

  return <SelectContext.Provider value={contextValue}><div ref={containerRef} className="relative">{children}</div></SelectContext.Provider>;
};

// FIX: Refactored SelectTrigger to accept children, removing the hardcoded SelectValue for better composability.
export const SelectTrigger = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within a Select");
  
  return (
    <button ref={context.triggerRef} onClick={() => context.setIsOpen(!context.isOpen)} className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 text-white rounded-md hover:bg-slate-800/60 transition-colors duration-200 ${className}`} {...props}>
      {children}
      <ChevronDown className={`h-4 w-4 transition-transform ${context.isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within a Select");
  return <span>{context.selectedLabel || placeholder}</span>;
};

export const SelectContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within a Select");
  
  if (!context.isOpen) return null;

  return (
    <div className={`absolute z-50 mt-1 w-full min-w-full left-0 bg-[#252849] backdrop-blur-lg border border-slate-700 rounded-md shadow-lg p-1 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within a Select");
  
  const isSelected = context.selectedValue === value;

  useEffect(() => {
    if (isSelected) {
      context.setSelectedLabel(typeof children === 'string' ? children : '');
    }
  }, [isSelected, children, context.setSelectedLabel]);

  const handleSelect = () => {
    context.setSelectedValue(value);
    context.setSelectedLabel(typeof children === 'string' ? children : '');
    context.setIsOpen(false);
  };
  
  return (
    <div onClick={handleSelect} className={`px-3 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-slate-800/60 ${isSelected ? 'bg-blue-500/30' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};