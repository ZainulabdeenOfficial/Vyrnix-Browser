import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';
import DownloadsPage from './DownloadsPage';
import ExtensionsPage from './ExtensionsPage';
import WallpaperSettingsSection from './WallpaperSettingsSection';
import BookmarksPage from './BookmarksPage';
import HistoryPage from './HistoryPage';
import WalletPage from './WalletPage';
import RewardsPage from './RewardsPage';

const Sidebar = () => {
  const { 
    currentView, 
    setCurrentView, 
    bookmarks, 
    history, 
    createNewTab,
    activeTabId,
    navigateTab,
    clearHistory
  } = useBrowser();
  const { isDark } = useTheme();

  const handleBookmarkClick = (url) => {
    if (activeTabId) {
      navigateTab(activeTabId, url);
    } else {
      createNewTab(url);
    }
  };

  const handleHistoryClick = (url) => {
    if (activeTabId) {
      navigateTab(activeTabId, url);
    } else {
      createNewTab(url);
    }
  };

  const sidebarItems = [
    { 
      id: 'bookmarks', 
      label: 'Bookmarks', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      )
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'wallet', 
      label: 'Wallet', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      )
    },
    { 
      id: 'rewards', 
      label: 'Rewards', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { id: 'downloads', label: 'Downloads', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 16a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 112 0v1a3 3 0 01-3 3H4a3 3 0 01-3-3v-1a1 1 0 112 0v1z" /><path d="M7 10V3a1 1 0 112 0v7h2V3a1 1 0 112 0v7h1.586a1 1 0 01.707 1.707l-4.293 4.293a1 1 0 01-1.414 0l-4.293-4.293A1 1 0 014.414 10H7z" /></svg>
    ) },
    { id: 'extensions', label: 'Extensions', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 2a2 2 0 00-2 2v2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2h2a2 2 0 002-2v-8a2 2 0 00-2-2H8zm0 2h8v8h-2V8a2 2 0 00-2-2H8V4zm0 4h4a1 1 0 011 1v4h-6V9a1 1 0 011-1z" /></svg>
    ) },
  ];

  return (
    <div className={`
      w-80 h-full sidebar border-r
      ${isDark ? 'border-vyrnix-gray-700 bg-vyrnix-gray-800' : 'border-vyrnix-gray-200 bg-vyrnix-gray-50'}
      flex flex-col
    `}>
      {/* Sidebar Navigation */}
      <div className={`
        p-6 border-b
        ${isDark ? 'border-vyrnix-gray-700' : 'border-vyrnix-gray-200'}
      `}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
          Navigation
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                flex flex-col items-center space-y-2 p-4 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105
                ${currentView === item.id
                  ? isDark
                    ? 'bg-vyrnix-primary text-white shadow-lg shadow-vyrnix-primary/30'
                    : 'bg-vyrnix-primary text-white shadow-lg shadow-vyrnix-primary/30'
                  : isDark
                    ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700 bg-vyrnix-gray-750'
                    : 'text-vyrnix-gray-600 hover:bg-white bg-white shadow-sm hover:shadow-md'
                }
              `}
              title={item.label}
            >
              <div className={`p-2 rounded-lg ${currentView === item.id ? 'bg-white/20' : ''}`}>
                {item.icon}
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-120px)]">
        {currentView === 'downloads' && <DownloadsPage />}
        {currentView === 'extensions' && <ExtensionsPage />}
        {currentView === 'bookmarks' && <BookmarksPage />}
        {currentView === 'history' && <HistoryPage />}
        {currentView === 'wallet' && <WalletPage />}
        {currentView === 'rewards' && <RewardsPage />}
        {currentView === 'settings' && (
          <div className="p-4">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-brave-gray-800'}`}>Settings</h3>
            {/* Wallpaper management UI moved here */}
            <WallpaperSettingsSection />
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-brave-gray-700' : 'bg-brave-gray-100'}`}>
                <h4 className="font-medium mb-2">Privacy & Security</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Block ads and trackers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">HTTPS only mode</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Show bookmarks bar</span>
                  </label>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-brave-gray-700' : 'bg-brave-gray-100'}`}>
                <h4 className="font-medium mb-2">Search Engine</h4>
                <select className={`w-full p-2 rounded ${isDark ? 'bg-brave-gray-600 text-white' : 'bg-white'}`}>
                  <option value="google">Google</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                  <option value="bing">Bing</option>
                  <option value="brave">Brave Search</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 