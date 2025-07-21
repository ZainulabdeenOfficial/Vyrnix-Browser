import React from 'react';
import { useBrowser } from '../contexts/BrowserContext';

const DownloadsPage = () => {
  const { downloads, pauseDownload, resumeDownload, cancelDownload, openDownload, clearDownloads } = useBrowser();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Downloads</h3>
        <button
          onClick={clearDownloads}
          className="px-3 py-1 rounded text-xs font-medium bg-vyrnix-gray-200 text-vyrnix-gray-700 hover:bg-vyrnix-primary hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>
      {downloads.length === 0 ? (
        <p className="text-sm text-vyrnix-gray-500">No downloads yet.</p>
      ) : (
        <div className="space-y-4">
          {downloads.map(dl => (
            <div key={dl.id} className="p-4 rounded-lg bg-white shadow flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate max-w-xs">{dl.filename}</span>
                  <span className="text-xs text-vyrnix-gray-500">{(dl.receivedBytes / 1024 / 1024).toFixed(2)}MB / {(dl.totalBytes / 1024 / 1024).toFixed(2)}MB</span>
                </div>
                <div className="w-full bg-vyrnix-gray-100 rounded h-2 mt-2 mb-2">
                  <div
                    className="bg-vyrnix-primary h-2 rounded"
                    style={{ width: dl.totalBytes ? `${(dl.receivedBytes / dl.totalBytes) * 100}%` : '0%' }}
                  ></div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`rounded px-2 py-1 ${dl.state === 'completed' ? 'bg-green-100 text-green-700' : dl.state === 'interrupted' ? 'bg-red-100 text-red-700' : 'bg-vyrnix-gray-200 text-vyrnix-gray-700'}`}>{dl.state}</span>
                  {dl.paused && <span className="bg-yellow-100 text-yellow-700 rounded px-2 py-1">Paused</span>}
                  {dl.error && <span className="bg-red-100 text-red-700 rounded px-2 py-1">{dl.error}</span>}
                </div>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                {dl.state === 'progressing' && !dl.paused && (
                  <button onClick={() => pauseDownload(dl.id)} className="px-2 py-1 rounded bg-yellow-200 text-yellow-800 hover:bg-yellow-300">Pause</button>
                )}
                {dl.state === 'progressing' && dl.paused && (
                  <button onClick={() => resumeDownload(dl.id)} className="px-2 py-1 rounded bg-green-200 text-green-800 hover:bg-green-300">Resume</button>
                )}
                {dl.state === 'progressing' && (
                  <button onClick={() => cancelDownload(dl.id)} className="px-2 py-1 rounded bg-red-200 text-red-800 hover:bg-red-300">Cancel</button>
                )}
                {dl.state === 'completed' && (
                  <button onClick={() => openDownload(dl.id)} className="px-2 py-1 rounded bg-blue-200 text-blue-800 hover:bg-blue-300">Open</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadsPage; 