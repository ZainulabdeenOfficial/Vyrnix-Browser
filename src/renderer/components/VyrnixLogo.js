import React from 'react';

const VyrnixLogo = ({ size = 48, className = '', showText = true, variant = 'default' }) => {
  const logoColors = {
    default: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#3b82f6'
    },
    light: {
      primary: '#ffffff',
      secondary: '#f1f5f9',
      accent: '#e2e8f0'
    },
    dark: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#475569'
    }
  };

  const colors = logoColors[variant] || logoColors.default;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Vyrnix Logo SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background Circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill={colors.primary}
          className="drop-shadow-lg"
        />
        
        {/* Inner Design - V Shape with Circuit Pattern */}
        <path
          d="M20 20 L32 44 L44 20"
          stroke={colors.secondary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Circuit Pattern */}
        <circle cx="24" cy="24" r="2" fill={colors.accent} />
        <circle cx="40" cy="24" r="2" fill={colors.accent} />
        <circle cx="32" cy="32" r="3" fill="white" />
        
        {/* Connection Lines */}
        <line x1="24" y1="26" x2="30" y2="30" stroke={colors.accent} strokeWidth="1.5" />
        <line x1="40" y1="26" x2="34" y2="30" stroke={colors.accent} strokeWidth="1.5" />
        
        {/* Digital Pattern */}
        <rect x="28" y="48" width="8" height="2" rx="1" fill={colors.accent} />
        <rect x="26" y="52" width="12" height="2" rx="1" fill={colors.secondary} />
        
        {/* Highlight */}
        <circle
          cx="32"
          cy="32"
          r="25"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-vyrnix-primary dark:text-white">
            Vyrnix
          </span>
          <span className="text-xs text-vyrnix-gray-500 dark:text-vyrnix-gray-400 -mt-1">
            Browser
          </span>
        </div>
      )}
    </div>
  );
};

export default VyrnixLogo; 