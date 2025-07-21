import React, { useState, useEffect, useRef } from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';
import VyrnixLogo from './VyrnixLogo';
import { preloadFavicons } from '../utils/faviconUtils';
import AddBookmarkModal from './AddBookmarkModal';
// REMOVE wallpaper management UI and logic (move to WallpaperSettingsSection)
import { WALLPAPER_KEY, WALLPAPER_INDEX_KEY } from './WallpaperSettingsSection';

const WelcomePage = () => {
  const { createNewTab, bookmarks, setSidebarOpen, history, adsBlocked, trackersBlocked } = useBrowser();
  const { isDark, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [todayStats, setTodayStats] = useState({
    sitesVisited: 0,
    adsBlocked: 0,
    trackersBlocked: 0,
    timesSaved: '0 seconds'
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customBookmarks, setCustomBookmarks] = useState([]);
  // REMOVE: wallpaper management state and logic
  const [wallpapers, setWallpapers] = useState([]); // REMOVE
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0); // REMOVE
  const [intervalMinutes, setIntervalMinutes] = useState(5); // REMOVE
  const intervalRef = useRef(); // REMOVE

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate today's stats
  useEffect(() => {
    const today = new Date().toDateString();
    const todayHistory = history.filter(item => 
      item.timestamp && new Date(item.timestamp).toDateString() === today
    );
    // Estimate time saved: 0.5s per ad/tracker blocked
    const totalBlocked = adsBlocked + trackersBlocked;
    let timesSaved = '';
    if (totalBlocked > 0) {
      const seconds = Math.round(totalBlocked * 0.5);
      if (seconds < 60) {
        timesSaved = `${seconds} seconds`;
      } else {
        const minutes = (seconds / 60).toFixed(1);
        timesSaved = `${minutes} minutes`;
      }
    } else {
      timesSaved = '0 seconds';
    }
    setTodayStats(prev => ({
      ...prev,
      sitesVisited: todayHistory.length,
      adsBlocked: adsBlocked,
      trackersBlocked: trackersBlocked,
      timesSaved
    }));
  }, [history, adsBlocked, trackersBlocked]);

  // Mock weather data
  useEffect(() => {
    setWeatherData({
      location: 'Your Location',
      temperature: '22°C',
      condition: 'Partly Cloudy',
      icon: '⛅'
    });
  }, []);

  // Mock news data
  useEffect(() => {
    setNewsItems([
      {
        id: 1,
        title: 'Privacy Protection: New Features in Vyrnix',
        summary: 'Enhanced tracker blocking and secure browsing improvements.',
        source: 'Vyrnix Blog',
        time: '2 hours ago',
        category: 'Tech'
      },
      {
        id: 2,
        title: 'Web3 Integration Update',
        summary: 'Seamless cryptocurrency wallet integration now available.',
        source: 'Crypto News',
        time: '4 hours ago',
        category: 'Crypto'
      },
      {
        id: 3,
        title: 'Enhanced Security Features',
        summary: 'New HTTPS enforcement and secure DNS protection.',
        source: 'Security Today',
        time: '6 hours ago',
        category: 'Security'
      }
    ]);
  }, []);

  // Only keep logic to load and use current wallpaper for background
  useEffect(() => {
    const savedWallpapers = localStorage.getItem(WALLPAPER_KEY);
    const savedIndex = localStorage.getItem(WALLPAPER_INDEX_KEY);
    if (savedWallpapers) {
      try {
        setWallpapers(JSON.parse(savedWallpapers));
      } catch {}
    }
    if (savedIndex) setCurrentWallpaperIndex(Number(savedIndex));
  }, []);

  const currentWallpaper = wallpapers[currentWallpaperIndex];
  const backgroundStyle = currentWallpaper
    ? {
        backgroundImage: `url(${currentWallpaper.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.5s',
      }
    : {};

  // Handle wallpaper upload
  const handleWallpaperUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setWallpapers(prev => [...prev, { id: Date.now(), url: ev.target.result, name: file.name }]);
      setCurrentWallpaperIndex(wallpapers.length); // Set to new wallpaper
    };
    reader.readAsDataURL(file);
  };

  // Remove wallpaper
  const handleRemoveWallpaper = (id) => {
    setWallpapers(prev => prev.filter(wp => wp.id !== id));
    setCurrentWallpaperIndex(0);
  };

  // Set wallpaper manually
  const handleSetWallpaper = (idx) => {
    setCurrentWallpaperIndex(idx);
  };

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com', favicon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32', color: 'bg-blue-500' },
    { name: 'GitHub', url: 'https://github.com', favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32', color: 'bg-gray-800' },
    { name: 'YouTube', url: 'https://www.youtube.com', favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=32', color: 'bg-red-500' },
    { name: 'Reddit', url: 'https://www.reddit.com', favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32', color: 'bg-orange-500' },
    { name: 'Twitter', url: 'https://twitter.com', favicon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=32', color: 'bg-sky-500' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com', favicon: 'https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=32', color: 'bg-orange-600' },
    { name: 'Wikipedia', url: 'https://wikipedia.org', favicon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=32', color: 'bg-gray-600' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32', color: 'bg-orange-400' }
  ];

  // Load custom bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('vyrnix-custom-bookmarks');
    if (savedBookmarks) {
      try {
        setCustomBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Failed to load custom bookmarks:', error);
      }
    }
  }, []);

  // Save custom bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('vyrnix-custom-bookmarks', JSON.stringify(customBookmarks));
  }, [customBookmarks]);

  // Combine default and custom bookmarks
  const allQuickLinks = [...quickLinks, ...customBookmarks];

  // Preload favicons for better performance
  useEffect(() => {
    const faviconUrls = allQuickLinks.map(link => link.favicon);
    preloadFavicons(faviconUrls);
  }, [allQuickLinks]);

  const handleAddCustomBookmark = (bookmark) => {
    setCustomBookmarks(prev => [...prev, { ...bookmark, id: Date.now() }]);
  };

  const handleRemoveCustomBookmark = (id) => {
    setCustomBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const handleQuickLinkClick = (url) => {
    createNewTab(url);
  };

  const handleBookmarkClick = (url) => {
    createNewTab(url);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let url = searchQuery.trim();
    
    // Check if it's already a valid URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it looks like a domain (contains . and no spaces)
      if (url.includes('.') && !url.includes(' ') && url.split('.').length >= 2) {
        url = 'https://' + url;
      } else {
        // Treat as search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    createNewTab(url);
    setSearchQuery('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div
      className={`h-full w-full overflow-y-auto ${isDark ? 'bg-vyrnix-gray-900' : 'bg-gradient-to-br from-vyrnix-gray-50 to-white'}`}
      style={backgroundStyle}
    >
      <div className="min-h-full p-8 bg-white/70 dark:bg-vyrnix-gray-900/70 backdrop-blur-md">
        {/* REMOVE Wallpaper Management UI here */}
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-6">
              <VyrnixLogo size={64} showText={true} />
              <div className={`text-right ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                <div className="text-3xl font-light">{formatTime(currentTime)}</div>
                <div className="text-sm text-vyrnix-gray-500">{formatDate(currentTime)}</div>
              </div>
            </div>
            
            {weatherData && (
              <div className={`flex items-center space-x-3 p-4 rounded-xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-sm'}`}>
                <span className="text-2xl">{weatherData.icon}</span>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                    {weatherData.temperature}
                  </div>
                  <div className="text-sm text-vyrnix-gray-500">{weatherData.condition}</div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className={`relative rounded-2xl shadow-lg ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white'}`}>
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-vyrnix-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  placeholder="Search the web or enter a URL..."
                  className={`w-full py-4 pl-14 pr-6 text-lg rounded-2xl focus:outline-none focus:ring-2 focus:ring-vyrnix-primary ${
                    isDark 
                      ? 'bg-vyrnix-gray-800 text-white placeholder-vyrnix-gray-400' 
                      : 'bg-white text-vyrnix-gray-800 placeholder-vyrnix-gray-500'
                  }`}
                />
              </div>
            </form>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Quick Access & Bookmarks */}
            <div className="xl:col-span-2 space-y-8">
              {/* Quick Access */}
              <div>
                <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  Quick Access
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {allQuickLinks.map((link) => (
                    <div key={link.name + (link.id || '')} className="relative group">
                      <button
                        onClick={() => handleQuickLinkClick(link.url)}
                        className={`w-full p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          isDark 
                            ? 'bg-vyrnix-gray-800 hover:bg-vyrnix-gray-700' 
                            : 'bg-white hover:shadow-md shadow-sm'
                        }`}
                      >
                        <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:shadow-lg transition-shadow p-2`}>
                          <img 
                            src={link.favicon} 
                            alt={link.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              // Fallback to a generic icon if favicon fails to load
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div 
                            className="w-8 h-8 flex items-center justify-center text-white text-lg hidden"
                            style={{ display: 'none' }}
                          >
                            🌐
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-vyrnix-gray-300' : 'text-vyrnix-gray-600'}`}>
                          {link.name}
                        </div>
                      </button>
                      
                      {/* Remove button for custom bookmarks */}
                      {link.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomBookmark(link.id);
                          }}
                          className={`
                            absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity
                            ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}
                            text-white text-xs shadow-lg
                          `}
                          title="Remove bookmark"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Add New Bookmark Button */}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className={`group p-4 rounded-xl transition-all duration-200 transform hover:scale-105 border-2 border-dashed ${
                      isDark 
                        ? 'border-vyrnix-gray-600 hover:border-vyrnix-gray-500 hover:bg-vyrnix-gray-800' 
                        : 'border-vyrnix-gray-300 hover:border-vyrnix-gray-400 hover:bg-vyrnix-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto transition-all ${
                      isDark ? 'bg-vyrnix-gray-700 text-vyrnix-gray-400 group-hover:bg-vyrnix-gray-600' : 'bg-vyrnix-gray-200 text-vyrnix-gray-500 group-hover:bg-vyrnix-gray-300'
                    }`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className={`text-sm font-medium ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-500'}`}>
                      Add Site
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Bookmarks */}
              {bookmarks.length > 0 && (
                <div>
                  <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                    Recent Bookmarks
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bookmarks.slice(0, 4).map((bookmark) => (
                      <button
                        key={bookmark.id}
                        onClick={() => handleBookmarkClick(bookmark.url)}
                        className={`p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] ${
                          isDark 
                            ? 'bg-vyrnix-gray-800 hover:bg-vyrnix-gray-700' 
                            : 'bg-white hover:shadow-md shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex-shrink-0">
                            {bookmark.favicon ? (
                              <img src={bookmark.favicon} alt="" className="w-full h-full rounded" />
                            ) : (
                              <div className="w-full h-full rounded bg-vyrnix-primary flex items-center justify-center text-white text-sm">
                                {bookmark.title?.charAt(0) || '🌐'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                              {bookmark.title}
                            </p>
                            <p className="text-sm text-vyrnix-gray-500 truncate">
                              {bookmark.url}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Stats & News */}
            <div className="xl:col-span-2 space-y-8">
              {/* Privacy Stats */}
              <div>
                <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  Today's Protection
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-6 rounded-xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                          {todayStats.adsBlocked.toLocaleString()}
                        </div>
                        <div className="text-sm text-vyrnix-gray-500">Ads Blocked</div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                          {todayStats.trackersBlocked.toLocaleString()}
                        </div>
                        <div className="text-sm text-vyrnix-gray-500">Trackers Blocked</div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                          {todayStats.sitesVisited}
                        </div>
                        <div className="text-sm text-vyrnix-gray-500">Sites Visited</div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-vyrnix-primary rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                          {todayStats.timesSaved}
                        </div>
                        <div className="text-sm text-vyrnix-gray-500">Time Saved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* News Feed */}
              <div>
                <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  Tech News
                </h2>
                <div className="space-y-4">
                  {newsItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer ${
                        isDark ? 'bg-vyrnix-gray-800 hover:bg-vyrnix-gray-700' : 'bg-white shadow-sm hover:shadow-md'
                      }`}
                      onClick={() => createNewTab('https://www.google.com/search?q=' + encodeURIComponent(item.title))}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.category === 'Tech' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'Crypto' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-vyrnix-gray-500">{item.time}</span>
                      </div>
                      <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-vyrnix-gray-500 mb-2">{item.summary}</p>
                      <p className="text-xs text-vyrnix-gray-400">{item.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="mt-16">
            <h2 className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Privacy Protection */}
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-lg'}`}>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  Privacy First
                </h3>
                <p className={`text-sm ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>
                  Advanced ad blocking, tracker protection, and HTTPS enforcement keep your data secure.
                </p>
              </div>

              {/* Fast Performance */}
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-lg'}`}>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  Lightning Fast
                </h3>
                <p className={`text-sm ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>
                  Optimized Chromium engine delivers blazing fast page loads and smooth browsing.
                </p>
              </div>

              {/* Web3 Ready */}
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-lg'}`}>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  Web3 Ready
                </h3>
                <p className={`text-sm ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>
                  Built-in crypto wallet and DeFi integration for the decentralized web.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="mt-16">
            <h2 className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
              Quick Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className={`p-6 rounded-2xl border-2 border-dashed ${isDark ? 'border-vyrnix-gray-700 bg-vyrnix-gray-800/50' : 'border-vyrnix-gray-300 bg-vyrnix-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  🚀 Keyboard Shortcuts
                </h3>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>
                  <li><kbd className="px-2 py-1 bg-vyrnix-gray-200 dark:bg-vyrnix-gray-700 rounded text-xs">Ctrl+T</kbd> - New tab</li>
                  <li><kbd className="px-2 py-1 bg-vyrnix-gray-200 dark:bg-vyrnix-gray-700 rounded text-xs">Ctrl+W</kbd> - Close tab</li>
                  <li><kbd className="px-2 py-1 bg-vyrnix-gray-200 dark:bg-vyrnix-gray-700 rounded text-xs">Ctrl+Shift+I</kbd> - Developer tools</li>
                  <li><kbd className="px-2 py-1 bg-vyrnix-gray-200 dark:bg-vyrnix-gray-700 rounded text-xs">Ctrl+L</kbd> - Focus address bar</li>
                </ul>
              </div>

              <div className={`p-6 rounded-2xl border-2 border-dashed ${isDark ? 'border-vyrnix-gray-700 bg-vyrnix-gray-800/50' : 'border-vyrnix-gray-300 bg-vyrnix-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
                  🔧 Customization
                </h3>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>
                  <li>• Add custom sites to Quick Access</li>
                  <li>• Choose from 12 background colors</li>
                  <li>• Toggle dark/light themes</li>
                  <li>• Organize bookmarks and history</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-8 mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isDark 
                    ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-800 bg-vyrnix-gray-800' 
                    : 'text-vyrnix-gray-600 hover:bg-white bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                <span>Wallet</span>
              </button>
              
              <button
                onClick={() => setSidebarOpen(true)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isDark 
                    ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-800 bg-vyrnix-gray-800' 
                    : 'text-vyrnix-gray-600 hover:bg-white bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span>Rewards</span>
              </button>

              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isDark 
                    ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-800 bg-vyrnix-gray-800' 
                    : 'text-vyrnix-gray-600 hover:bg-white bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
                <span>{isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
            
            <div className={`max-w-2xl mx-auto p-6 rounded-2xl ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white shadow-lg'}`}>
              <p className={`text-sm mb-4 ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>
                Vyrnix Browser - Built for privacy, speed, and the future of the web
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-vyrnix-gray-700 text-vyrnix-gray-300' : 'bg-vyrnix-gray-100 text-vyrnix-gray-600'}`}>
                  Version 1.0.0
                </span>
                <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-vyrnix-gray-700 text-vyrnix-gray-300' : 'bg-vyrnix-gray-100 text-vyrnix-gray-600'}`}>
                  Chromium Engine
                </span>
                <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-vyrnix-gray-700 text-vyrnix-gray-300' : 'bg-vyrnix-gray-100 text-vyrnix-gray-600'}`}>
                  Privacy First
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCustomBookmark}
      />
    </div>
  );
};

export default WelcomePage; 