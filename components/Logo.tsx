import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF"/>
              <stop offset="100%" stopColor="#E0E7FF"/>
            </linearGradient>
          </defs>
          <rect x="4" y="10" width="4" height="8" rx="1" fill="url(#logoGradient)"/>
          <rect x="10" y="4" width="4" height="14" rx="1" fill="url(#logoGradient)"/>
          <rect x="16" y="14" width="4" height="4" rx="1" fill="url(#logoGradient)"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">Miracle Analytics</h1>
    </div>
  );
};

export const LogoIconOnly: React.FC<LogoProps> = ({ className }) => (
  <div className={`inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-3 rounded-2xl ${className}`}>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <rect x="4" y="10" width="4" height="8" rx="1" fill="#FFFFFF"/>
       <rect x="10" y="4" width="4" height="14" rx="1" fill="#FFFFFF"/>
       <rect x="16" y="14" width="4" height="4" rx="1" fill="#FFFFFF"/>
    </svg>
  </div>
);
