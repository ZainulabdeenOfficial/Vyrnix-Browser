import React, { useEffect } from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';
import TitleBar from './TitleBar';
import TabBar from './TabBar';
import AddressBar from './AddressBar';
import BookmarksBar from './BookmarksBar';
import Sidebar from './Sidebar';
import WelcomePage from './WelcomePage';

const BrowserInterface = () => {
  const { 
    tabs, 
    activeTabId, 
    createNewTab, 
    sidebarOpen, 
    currentView,
    settings 
  } = useBrowser();
  const { isDark } = useTheme();

  // Show welcome page when no tabs are open
  // No need to create a tab automatically - let the welcome page handle navigation

  return (
    <div className={`h-full w-full flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* Custom Title Bar */}
      <TitleBar />
      
      {/* Tab Bar */}
      <TabBar />
      
      {/* Address Bar */}
      <AddressBar />
      
      {/* Bookmarks Bar */}
      {settings.showBookmarksBar && <BookmarksBar />}
      
      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-y-auto">
        {/* Sidebar */}
        {sidebarOpen && <Sidebar />}
        
        {/* Browser Content */}
        <div className="flex-1 h-full w-full bg-white dark:bg-brave-dark overflow-y-auto">
          {tabs.length === 0 || !activeTabId || !tabs.find(tab => tab.id === activeTabId)?.url ? (
            <WelcomePage />
          ) : (
            // The actual web content will be rendered by Electron's BrowserView
            // This is just a placeholder for when no tabs are active
            <div className="h-full w-full bg-white dark:bg-brave-dark">
              {/* Web content goes here via Electron BrowserView */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowserInterface; 