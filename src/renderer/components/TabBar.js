import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';

const TabBar = () => {
  const { 
    tabs, 
    activeTabId, 
    createNewTab, 
    closeTab, 
    switchTab 
  } = useBrowser();
  const { isDark } = useTheme();

  const handleTabClick = (tabId) => {
    switchTab(tabId);
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const handleNewTab = () => {
    createNewTab();
  };

  return (
    <div className={`
      h-12 flex items-center px-2 space-x-2
      ${isDark ? 'bg-vyrnix-gray-800' : 'bg-vyrnix-gray-100'}
      border-b ${isDark ? 'border-vyrnix-gray-700' : 'border-vyrnix-gray-200'}
      shadow-sm
    `}>
      <div className="flex-1 flex items-center overflow-x-auto space-x-2">
        {/* Tabs */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 min-w-0 max-w-xs cursor-pointer
              tab-hover group relative
              rounded-xl shadow transition-all duration-150
              ${activeTabId === tab.id 
                ? isDark 
                  ? 'bg-white/10 text-white border border-vyrnix-primary shadow-lg' 
                  : 'bg-white text-vyrnix-primary border border-vyrnix-primary shadow-lg'
                : isDark
                  ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700 border border-transparent'
                  : 'text-vyrnix-gray-600 hover:bg-vyrnix-gray-200 border border-transparent'
              }
              mr-2
            `}
            style={{ minWidth: 120, maxWidth: 220 }}
          >
            {/* Favicon */}
            <div className="w-4 h-4 flex-shrink-0">
              {tab.favicon ? (
                <img src={tab.favicon} alt="" className="w-full h-full rounded" />
              ) : (
                <div className={`w-full h-full rounded bg-vyrnix-gray-300 dark:bg-vyrnix-gray-600`}></div>
              )}
            </div>
            {/* Loading indicator */}
            {tab.isLoading && (
              <div className="w-3 h-3 flex-shrink-0">
                <div className={`w-full h-full border-2 border-transparent rounded-full loading-spinner ${isDark ? 'border-t-white' : 'border-t-vyrnix-gray-600'}`}></div>
              </div>
            )}
            {/* Title */}
            <span className="flex-1 truncate text-sm font-medium">{tab.title || 'Loading...'}</span>
            {/* Close button */}
            <button
              onClick={(e) => handleCloseTab(e, tab.id)}
              className={`w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-vyrnix-gray-300 dark:hover:bg-vyrnix-gray-600 transition-all flex-shrink-0`}
              title="Close tab"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        {/* New Tab Button */}
        <button
          onClick={handleNewTab}
          className={`flex items-center justify-center w-10 h-10 ml-2 rounded-full border-2 border-dashed border-vyrnix-primary bg-white text-vyrnix-primary hover:bg-vyrnix-primary hover:text-white transition-all duration-150 shadow`}
          title="New tab (Ctrl+T)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TabBar; 