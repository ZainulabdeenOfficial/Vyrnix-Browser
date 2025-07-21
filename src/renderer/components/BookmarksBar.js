import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';

const BookmarksBar = () => {
  const { 
    bookmarks, 
    removeBookmark, 
    createNewTab,
    activeTabId,
    navigateTab
  } = useBrowser();
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

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div className={`
      h-8 flex items-center px-4 space-x-1 overflow-x-auto
      ${isDark ? 'bg-brave-gray-800' : 'bg-brave-gray-50'}
      border-b ${isDark ? 'border-brave-gray-700' : 'border-brave-gray-200'}
    `}>
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          onClick={() => handleBookmarkClick(bookmark.url)}
          className={`
            flex items-center space-x-2 px-3 py-1 rounded cursor-pointer group
            ${isDark 
              ? 'hover:bg-brave-gray-700 text-brave-gray-300' 
              : 'hover:bg-brave-gray-200 text-brave-gray-700'
            }
            transition-colors flex-shrink-0
          `}
          title={bookmark.url}
        >
          {/* Favicon */}
          <div className="w-3 h-3 flex-shrink-0">
            {bookmark.favicon ? (
              <img src={bookmark.favicon} alt="" className="w-full h-full" />
            ) : (
              <div className={`
                w-full h-full rounded-sm flex items-center justify-center
                ${isDark ? 'bg-brave-gray-600' : 'bg-brave-gray-300'}
              `}>
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <span className="text-xs truncate max-w-24">
            {bookmark.title}
          </span>

          {/* Remove button */}
          <button
            onClick={(e) => handleBookmarkRemove(e, bookmark.id)}
            className={`
              w-3 h-3 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100
              hover:bg-red-500 hover:text-white transition-all flex-shrink-0 ml-1
            `}
            title="Remove bookmark"
          >
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookmarksBar; 