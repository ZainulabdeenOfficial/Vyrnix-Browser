import React, { useState, useEffect, useRef } from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';

const MAX_SUGGESTIONS = 7;

const AddressBar = () => {
  const {
    currentTab,
    activeTabId,
    navigateTab,
    createNewTab,
    setSidebarOpen,
    sidebarOpen,
    addBookmark,
    bookmarks,
    history,
    tabs // <-- add this line
  } = useBrowser();
  const { isDark, toggleTheme } = useTheme();

  const [addressValue, setAddressValue] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Combine bookmarks and history, remove duplicates by URL
  const allSuggestions = React.useMemo(() => {
    const seen = new Set();
    const combined = [...bookmarks, ...history];
    return combined.filter(item => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }, [bookmarks, history]);

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    if (!addressValue.trim()) return [];
    const q = addressValue.toLowerCase();
    return allSuggestions
      .filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q))
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [addressValue, allSuggestions]);

  // Update address bar when tab changes
  useEffect(() => {
    if (currentTab) {
      setAddressValue(currentTab.url || '');
      const bookmarked = bookmarks.some(bookmark => bookmark.url === currentTab.url);
      setIsBookmarked(bookmarked);
    }
  }, [currentTab, bookmarks]);

  // Update navigation state when tab changes
  useEffect(() => {
    const updateNavigationState = async () => {
      if (activeTabId && window.electronAPI) {
        try {
          const [back, forward] = await Promise.all([
            window.electronAPI.canGoBack(activeTabId),
            window.electronAPI.canGoForward(activeTabId)
          ]);
          setCanGoBack(back);
          setCanGoForward(forward);
        } catch (error) {
          setCanGoBack(false);
          setCanGoForward(false);
        }
      } else {
        setCanGoBack(false);
        setCanGoForward(false);
      }
    };
    updateNavigationState();
    const interval = activeTabId ? setInterval(updateNavigationState, 500) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTabId, currentTab?.url]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    let url = addressValue.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
      if (url.includes('.') && !url.includes(' ') && url.split('.').length >= 2) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    if (tabs.length > 0 && activeTabId) {
      navigateTab(activeTabId, url);
    } else {
      createNewTab(url);
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setAddressValue(suggestion.url);
    if (tabs.length > 0 && activeTabId) {
      navigateTab(activeTabId, suggestion.url);
    } else {
      createNewTab(suggestion.url);
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e) => {
    setAddressValue(e.target.value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0) setShowSuggestions(true);
  };

  const handleInputBlur = (e) => {
    // Delay hiding to allow click
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(idx => Math.min(idx + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        handleSuggestionClick(filteredSuggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleBack = async () => {
    if (activeTabId && canGoBack && window.electronAPI) {
      try {
        await window.electronAPI.goBack(activeTabId);
      } catch (error) {
        console.error('Failed to go back:', error);
      }
    }
  };

  const handleForward = async () => {
    if (activeTabId && canGoForward && window.electronAPI) {
      try {
        await window.electronAPI.goForward(activeTabId);
      } catch (error) {
        console.error('Failed to go forward:', error);
      }
    }
  };

  const handleRefresh = async () => {
    if (activeTabId && window.electronAPI) {
      try {
        await window.electronAPI.refresh(activeTabId);
      } catch (error) {
        console.error('Failed to refresh:', error);
      }
    }
  };

  const handleBookmark = () => {
    if (currentTab) {
      addBookmark({
        title: currentTab.title,
        url: currentTab.url,
        favicon: currentTab.favicon
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isSecure = currentTab?.url?.startsWith('https://');

  return (
    <div className={`
      h-12 flex items-center px-4 space-x-3
      ${isDark ? 'bg-vyrnix-gray-800' : 'bg-vyrnix-gray-100'}
      border-b ${isDark ? 'border-vyrnix-gray-700' : 'border-vyrnix-gray-200'}
    `}>
      {/* Navigation Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className={`
            p-2 rounded-full transition-colors
            ${canGoBack 
              ? isDark 
                ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700' 
                : 'text-vyrnix-gray-600 hover:bg-vyrnix-gray-200'
              : 'text-vyrnix-gray-400 cursor-not-allowed'
            }
          `}
          title="Back"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleForward}
          disabled={!canGoForward}
          className={`
            p-2 rounded-full transition-colors
            ${canGoForward 
              ? isDark 
                ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700' 
                : 'text-vyrnix-gray-600 hover:bg-vyrnix-gray-200'
              : 'text-vyrnix-gray-400 cursor-not-allowed'
            }
          `}
          title="Forward"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleRefresh}
          className={`
            p-2 rounded-full
            ${isDark 
              ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700' 
              : 'text-vyrnix-gray-600 hover:bg-vyrnix-gray-200'
            }
            transition-colors
          `}
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* Address Bar */}
      <form onSubmit={handleAddressSubmit} className="w-full relative">
        <div className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg address-bar
          ${isDark ? 'bg-vyrnix-gray-700' : 'bg-white'}
          border ${isDark ? 'border-vyrnix-gray-600' : 'border-vyrnix-gray-300'}
        `}>
          {/* Security indicator */}
          {currentTab?.url && (
            <div className="flex items-center">
              {isSecure ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1C4.477 1 0 5.477 0 11s4.477 10 10 10 10-4.477 10-10S15.523 1 10 1zM8 11a1 1 0 112 0 1 1 0 01-2 0zm1-7a1 1 0 011 1v3a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
          {/* URL Input */}
          <input
            ref={inputRef}
            type="text"
            value={addressValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search or enter address"
            className={`
              flex-1 bg-transparent outline-none text-sm
              ${isDark ? 'text-white placeholder-vyrnix-gray-400' : 'text-vyrnix-gray-800 placeholder-vyrnix-gray-500'}
            `}
            autoComplete="off"
          />
          {/* Bookmark button */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`
              p-1 rounded
              ${isBookmarked
                ? 'text-vyrnix-primary'
                : isDark
                  ? 'text-vyrnix-gray-400 hover:text-vyrnix-gray-300'
                  : 'text-vyrnix-gray-500 hover:text-vyrnix-gray-600'
              }
              transition-colors
            `}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className={`absolute left-0 right-0 mt-1 z-50 rounded-xl shadow-2xl border ${isDark ? 'bg-vyrnix-gray-900 border-vyrnix-gray-700' : 'bg-white border-vyrnix-gray-200'} animate-fadeIn`}
            style={{ maxHeight: 320, overflowY: 'auto', transition: 'box-shadow 0.2s' }}
            tabIndex={-1}
          >
            {filteredSuggestions.length === 0 ? (
              <div className={`px-4 py-3 text-center text-sm ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-500'}`}>No results found</div>
            ) : (
              filteredSuggestions.map((item, idx) => (
                <div
                  key={item.url + idx}
                  className={`flex items-center px-4 py-2 cursor-pointer select-none transition-colors
                    ${highlightedIndex === idx
                      ? isDark
                        ? 'bg-vyrnix-primary/30 text-vyrnix-primary'
                        : 'bg-vyrnix-primary/10 text-vyrnix-primary'
                      : isDark
                        ? 'hover:bg-vyrnix-gray-800 text-white'
                        : 'hover:bg-vyrnix-gray-100 text-vyrnix-gray-800'}
                    ${highlightedIndex === idx ? 'ring-2 ring-vyrnix-primary' : ''}
                  `}
                  onMouseDown={() => handleSuggestionClick(item)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  tabIndex={0}
                  aria-selected={highlightedIndex === idx}
                  role="option"
                >
                  {/* Favicon or icon */}
                  <div className="w-5 h-5 flex-shrink-0 mr-3">
                    {item.favicon ? (
                      <img src={item.favicon} alt="" className="w-full h-full rounded" />
                    ) : (
                      <span className="text-lg">🌐</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-sm leading-tight">{item.title || item.url}</div>
                    <div className={`truncate text-xs ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-500'}`}>{item.url}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </form>
      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-full
            ${isDark
              ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700'
              : 'text-vyrnix-gray-600 hover:bg-vyrnix-gray-200'
            }
            transition-colors
          `}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className={`
            p-2 rounded-full
            ${sidebarOpen ? 'bg-vyrnix-primary text-white' : ''}
            ${isDark
              ? 'text-vyrnix-gray-300 hover:bg-vyrnix-gray-700'
              : 'text-vyrnix-gray-600 hover:bg-vyrnix-gray-200'
            }
            transition-colors
          `}
          title="Toggle sidebar"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddressBar; 