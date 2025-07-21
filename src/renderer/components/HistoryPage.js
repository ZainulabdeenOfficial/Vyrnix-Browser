import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';
import { useTheme } from '../contexts/ThemeContext';

const HistoryPage = () => {
  const { history, clearHistory, createNewTab, activeTabId, navigateTab } = useBrowser();
  const { isDark } = useTheme();

  const handleHistoryClick = (url) => {
    if (activeTabId) {
      navigateTab(activeTabId, url);
    } else {
      createNewTab(url);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>History</h2>
        <button
          onClick={clearHistory}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-vyrnix-primary text-white hover:bg-vyrnix-primary/80 transition-colors shadow"
        >
          Clear History
        </button>
      </div>
      {history.length === 0 ? (
        <div className="text-center py-16">
          <p className={`text-lg ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-600'}`}>No browsing history yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.slice(0, 100).map((item, index) => (
            <div
              key={index}
              onClick={() => handleHistoryClick(item.url)}
              className={`p-5 rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-xl flex items-center space-x-4 ${isDark ? 'bg-vyrnix-gray-800 hover:bg-vyrnix-gray-700' : 'bg-white hover:bg-vyrnix-gray-50'}`}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-vyrnix-primary/10">
                <svg className="w-6 h-6 text-vyrnix-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>{item.title || item.url}</div>
                <div className="text-xs text-vyrnix-gray-500 truncate">{item.url}</div>
                {item.timestamp && (
                  <div className="text-xs text-vyrnix-gray-400 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 