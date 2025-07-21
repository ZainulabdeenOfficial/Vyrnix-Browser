import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BrowserContext = createContext();

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};

export const BrowserProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'light',
    searchEngine: 'google',
    adBlockEnabled: true,
    httpsOnlyMode: true,
    showBookmarksBar: true
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('browser'); // browser, wallet, rewards, settings
  const [adsBlocked, setAdsBlocked] = useState(0);
  const [trackersBlocked, setTrackersBlocked] = useState(0);
  const [downloads, setDownloads] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!window.electronAPI) return;

      try {
        const [loadedBookmarks, loadedHistory, loadedSettings, blockStats] = await Promise.all([
          window.electronAPI.getBookmarks(),
          window.electronAPI.getHistory(),
          window.electronAPI.getSettings(),
          window.electronAPI.getBlockStats ? window.electronAPI.getBlockStats() : { adsBlocked: 0, trackersBlocked: 0 }
        ]);

        setBookmarks(loadedBookmarks);
        setHistory(loadedHistory);
        setSettings(loadedSettings);
        setAdsBlocked(blockStats.adsBlocked || 0);
        setTrackersBlocked(blockStats.trackersBlocked || 0);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadData();
  }, []);

  // Listen for block-stats events
  useEffect(() => {
    if (!window.electronAPI || typeof window.electronAPI.onBlockStats !== 'function') return;
    const handler = (stats) => {
      setAdsBlocked(stats.adsBlocked);
      setTrackersBlocked(stats.trackersBlocked);
    };
    window.electronAPI.onBlockStats(handler);
    return () => {
      if (window.electronAPI.removeAllListeners) {
        window.electronAPI.removeAllListeners('block-stats');
      }
    };
  }, []);

  // Load initial downloads
  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.getDownloads().then(setDownloads);
    const handler = (downloads) => setDownloads(downloads);
    if (window.electronAPI.onDownloadsUpdate) {
      window.electronAPI.onDownloadsUpdate(handler);
    }
    return () => {
      if (window.electronAPI.removeAllListeners) {
        window.electronAPI.removeAllListeners('downloads-update');
      }
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!window.electronAPI) return;

    const handleTabUpdated = (event, tabId, tabData) => {
      setTabs(prevTabs => prevTabs.map(tab => 
        tab.id === tabId ? { ...tab, ...tabData } : tab
      ));
    };

    const handleNewTab = () => {
      createNewTab();
    };

    window.electronAPI.onTabUpdated(handleTabUpdated);
    window.electronAPI.onNewTab(handleNewTab);

    return () => {
      window.electronAPI.removeAllListeners('tab-updated');
      window.electronAPI.removeAllListeners('new-tab');
    };
  }, []);

  // Tab management
  const createNewTab = useCallback(async (url = null) => {
    if (!window.electronAPI) return;

    try {
      const tabData = await window.electronAPI.createTab(url);
      
      const newTab = {
        id: tabData.tabId,
        url: tabData.url,
        title: tabData.title || 'New Tab',
        favicon: null,
        isLoading: tabData.url ? true : false // Don't show loading for home screen tabs
      };

      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTabId(newTab.id);
      return newTab;
    } catch (error) {
      console.error('Failed to create tab:', error);
    }
  }, []);

  const closeTab = useCallback(async (tabId) => {
    if (!window.electronAPI) return;

    try {
      await window.electronAPI.closeTab(tabId);
      setTabs(prevTabs => {
        const filteredTabs = prevTabs.filter(tab => tab.id !== tabId);
        
        // If we closed the active tab, switch to another one
        if (activeTabId === tabId && filteredTabs.length > 0) {
          const newActiveTab = filteredTabs[filteredTabs.length - 1];
          setActiveTabId(newActiveTab.id);
          window.electronAPI.switchTab(newActiveTab.id);
        } else if (filteredTabs.length === 0) {
          setActiveTabId(null);
        }
        
        return filteredTabs;
      });
    } catch (error) {
      console.error('Failed to close tab:', error);
    }
  }, [activeTabId]);

  const switchTab = useCallback(async (tabId) => {
    if (!window.electronAPI) return;

    try {
      await window.electronAPI.switchTab(tabId);
      setActiveTabId(tabId);
    } catch (error) {
      console.error('Failed to switch tab:', error);
    }
  }, []);

  const navigateTab = useCallback(async (tabId, url) => {
    if (!window.electronAPI) return;

    try {
      await window.electronAPI.navigateTab(tabId, url);
      
      // Update tab state
      setTabs(prevTabs => prevTabs.map(tab =>
        tab.id === tabId 
          ? { ...tab, url, isLoading: true, title: 'Loading...' }
          : tab
      ));

      // Add to history
      await addToHistory({ url, title: 'Loading...' });
    } catch (error) {
      console.error('Failed to navigate tab:', error);
    }
  }, []);

  // Bookmark management
  const addBookmark = useCallback(async (bookmark) => {
    if (!window.electronAPI) return;

    try {
      const updatedBookmarks = await window.electronAPI.addBookmark(bookmark);
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  }, []);

  const removeBookmark = useCallback(async (bookmarkId) => {
    if (!window.electronAPI) return;

    try {
      const updatedBookmarks = await window.electronAPI.removeBookmark(bookmarkId);
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  }, []);

  // History management
  const addToHistory = useCallback(async (historyItem) => {
    if (!window.electronAPI) return;

    try {
      const updatedHistory = await window.electronAPI.addHistory(historyItem);
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    if (!window.electronAPI) return;
    try {
      await window.electronAPI.clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  // Settings management
  const updateSettings = useCallback(async (newSettings) => {
    if (!window.electronAPI) return;

    try {
      const updatedSettings = await window.electronAPI.updateSettings(newSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }, []);

  // Download management
  const pauseDownload = useCallback((id) => {
    if (window.electronAPI) window.electronAPI.pauseDownload(id);
  }, []);
  const resumeDownload = useCallback((id) => {
    if (window.electronAPI) window.electronAPI.resumeDownload(id);
  }, []);
  const cancelDownload = useCallback((id) => {
    if (window.electronAPI) window.electronAPI.cancelDownload(id);
  }, []);
  const openDownload = useCallback((id) => {
    if (window.electronAPI) window.electronAPI.openDownload(id);
  }, []);
  const clearDownloads = useCallback(() => {
    if (window.electronAPI) window.electronAPI.clearDownloads();
  }, []);

  // Window controls
  const minimizeWindow = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowMinimize();
    }
  }, []);

  const maximizeWindow = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowMaximize();
    }
  }, []);

  const closeWindow = useCallback(async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowClose();
    }
  }, []);

  // Get current tab
  const currentTab = tabs.find(tab => tab.id === activeTabId);

  const value = {
    // State
    tabs,
    activeTabId,
    currentTab,
    bookmarks,
    history,
    settings,
    sidebarOpen,
    currentView,
    adsBlocked,
    trackersBlocked,
    downloads,

    // Tab management
    createNewTab,
    closeTab,
    switchTab,
    navigateTab,

    // Bookmark management
    addBookmark,
    removeBookmark,

    // History management
    addToHistory,
    clearHistory,

    // Settings management
    updateSettings,

    // Download management
    pauseDownload,
    resumeDownload,
    cancelDownload,
    openDownload,
    clearDownloads,

    // UI management
    setSidebarOpen,
    setCurrentView,

    // Window controls
    minimizeWindow,
    maximizeWindow,
    closeWindow
  };

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
}; 