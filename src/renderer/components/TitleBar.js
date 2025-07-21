import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';
import VyrnixLogo from './VyrnixLogo';

const TitleBar = () => {
  const { minimizeWindow, maximizeWindow, closeWindow } = useBrowser();
  const { isDark } = useTheme();

  return (
    <div className={`
      h-8 flex items-center justify-between px-4 
      ${isDark ? 'bg-vyrnix-gray-800' : 'bg-vyrnix-gray-100'}
      border-b ${isDark ? 'border-vyrnix-gray-700' : 'border-vyrnix-gray-200'}
      drag-region
    `}>
      {/* Left side - Logo and title */}
      <div className="flex items-center space-x-2 no-drag">
        <VyrnixLogo size={20} showText={false} variant={isDark ? 'light' : 'default'} />
        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
          Vyrnix Browser
        </span>
      </div>

      {/* Right side - Window controls */}
      <div className="flex items-center space-x-1 window-controls no-drag">
        <button
          onClick={minimizeWindow}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-vyrnix-gray-300 dark:hover:bg-vyrnix-gray-600 transition-colors"
          title="Minimize"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={maximizeWindow}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-vyrnix-gray-300 dark:hover:bg-vyrnix-gray-600 transition-colors"
          title="Maximize"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={closeWindow}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500 hover:text-white transition-colors close-btn"
          title="Close"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 