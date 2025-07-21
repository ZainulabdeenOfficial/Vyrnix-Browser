import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';

const BookmarksPage = () => {
  const { bookmarks, removeBookmark, createNewTab, activeTabId, navigateTab } = useBrowser();
  const { isDark } = useTheme();

  const handleBookmarkClick = (url) => {
    if (activeTabId) {
      navigateTab(activeTabId, url);
    } else {
      createNewTab(url);
    }
  };

  const handleBookmarkRemove = (e, bookmarkId) => {
    e.stopPropagation();
    removeBookmark(bookmarkId);
  };

  return (
    <div className="p-8">
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <p className={`text-lg ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>No bookmarks yet.</p>
          <p className="text-sm mt-2">Add bookmarks from the address bar or welcome page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              onClick={() => handleBookmarkClick(bookmark.url)}
              className={`group p-6 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl flex items-center space-x-4 ${isDark ? 'bg-vyrnix-gray-800 hover:bg-vyrnix-gray-700' : 'bg-white hover:bg-vyrnix-gray-50'}`}
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-vyrnix-primary/10">
                {bookmark.favicon ? (
                  <img src={bookmark.favicon} alt="" className="w-8 h-8 rounded" />
                ) : (
                  <span className="text-2xl">🌐</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>{bookmark.title}</div>
                <div className="text-xs text-vyrnix-gray-500 truncate">{bookmark.url}</div>
              </div>
              <button
                onClick={(e) => handleBookmarkRemove(e, bookmark.id)}
                className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove bookmark"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage; 