const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Tab management
  createTab: (url) => ipcRenderer.invoke('create-tab', url),
  closeTab: (tabId) => ipcRenderer.invoke('close-tab', tabId),
  switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
  navigateTab: (tabId, url) => ipcRenderer.invoke('navigate-tab', tabId, url),
  
  // Bookmarks
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  addBookmark: (bookmark) => ipcRenderer.invoke('add-bookmark', bookmark),
  removeBookmark: (bookmarkId) => ipcRenderer.invoke('remove-bookmark', bookmarkId),
  
  // History
  getHistory: () => ipcRenderer.invoke('get-history'),
  addHistory: (historyItem) => ipcRenderer.invoke('add-history', historyItem),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  
  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  
  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Navigation controls
  goBack: (tabId) => ipcRenderer.invoke('go-back', tabId),
  goForward: (tabId) => ipcRenderer.invoke('go-forward', tabId),
  refresh: (tabId) => ipcRenderer.invoke('refresh', tabId),
  canGoBack: (tabId) => ipcRenderer.invoke('can-go-back', tabId),
  canGoForward: (tabId) => ipcRenderer.invoke('can-go-forward', tabId),
  
  // Event listeners
  onTabUpdated: (callback) => ipcRenderer.on('tab-updated', callback),
  onNewTab: (callback) => ipcRenderer.on('new-tab', callback),
  getBlockStats: () => ipcRenderer.invoke('get-block-stats'),
  onBlockStats: (callback) => ipcRenderer.on('block-stats', (event, stats) => callback(stats)),
  
  // Download manager
  getDownloads: () => ipcRenderer.invoke('get-downloads'),
  pauseDownload: (id) => ipcRenderer.invoke('pause-download', id),
  resumeDownload: (id) => ipcRenderer.invoke('resume-download', id),
  cancelDownload: (id) => ipcRenderer.invoke('cancel-download', id),
  openDownload: (id) => ipcRenderer.invoke('open-download', id),
  clearDownloads: () => ipcRenderer.invoke('clear-downloads'),
  onDownloadsUpdate: (callback) => ipcRenderer.on('downloads-update', (event, downloads) => callback(downloads)),
  
  // Extension management
  loadUnpackedExtension: () => ipcRenderer.invoke('load-unpacked-extension'),
  getLoadedExtensions: () => ipcRenderer.invoke('get-loaded-extensions'),
  enableExtension: (id) => ipcRenderer.invoke('enable-extension', id),
  disableExtension: (id) => ipcRenderer.invoke('disable-extension', id),
  removeExtension: (id) => ipcRenderer.invoke('remove-extension', id),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 