
import React, { useState } from 'react';
import { LayoutDashboard, UserCog, Upload as UploadIcon, LogOut, Menu } from 'lucide-react';
import { Logo, LogoIcon } from './Branding';
import { cn } from '../lib/utils';

interface SidebarLinkProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  isExpanded: boolean;
}

const SidebarItem = ({ label, icon, onClick, isActive, isExpanded }: SidebarLinkProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group w-full",
        isActive 
          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" 
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
      )}
      title={!isExpanded ? label : undefined}
    >
      <div className="flex-shrink-0 relative">
        {icon}
        {isActive && (
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-purple-500 rounded-r-full" />
        )}
      </div>
      
      <span className={cn(
        "whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left",
        isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
      )}>
        {label}
      </span>
    </button>
  );
};

interface AppSidebarProps {
  onUploadClick: () => void;
  onProfileClick: () => void;
  onSignOutClick: () => void;
  children?: React.ReactNode;
}

export const AppSidebar = ({ onUploadClick, onProfileClick, onSignOutClick, children }: AppSidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // The sidebar is expanded if hovered (desktop) or toggled open (mobile)
  const isExpanded = isHovered;

  const links = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, onClick: () => {}, isActive: true },
    { label: 'Upload File', icon: <UploadIcon className="w-5 h-5" />, onClick: onUploadClick, isActive: false },
    { label: 'Creator Profile', icon: <UserCog className="w-5 h-5" />, onClick: onProfileClick, isActive: false },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
         <Logo />
         <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-zinc-600 dark:text-zinc-300">
            <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}>
           <div className="w-64 h-full bg-white dark:bg-zinc-950 p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="mb-8"><Logo /></div>
              <div className="space-y-2">
                {links.map((link, idx) => (
                    <SidebarItem key={idx} {...link} isExpanded={true} onClick={() => { link.onClick(); setIsMobileOpen(false); }} />
                ))}
                 <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <SidebarItem label="Sign Out" icon={<LogOut className="w-5 h-5" />} onClick={onSignOutClick} isExpanded={true} />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black z-40 transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-16 flex items-center pl-5 overflow-hidden">
          <div className="transition-opacity duration-300">
            {isExpanded ? <Logo /> : <LogoIcon />}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-3 py-4">
          {links.map((link, idx) => (
            <SidebarItem 
              key={idx} 
              {...link} 
              isExpanded={isExpanded} 
            />
          ))}
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
           <SidebarItem 
              label="Sign Out" 
              icon={<LogOut className="w-5 h-5" />} 
              onClick={onSignOutClick} 
              isExpanded={isExpanded} 
           />
           
           <div className={cn(
             "mt-4 flex items-center gap-3 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 transition-all duration-300 overflow-hidden",
             isExpanded ? "opacity-100" : "opacity-0 h-0 p-0"
           )}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                MF
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">Miracle F.</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Admin</p>
              </div>
           </div>
        </div>
      </aside>
      
      {/* Main Content Wrapper */}
      {children}
    </>
  );
};
