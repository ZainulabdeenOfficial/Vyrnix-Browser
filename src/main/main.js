const { app, BrowserWindow, BrowserView, ipcMain, session, dialog, Menu, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

// Initialize secure storage
const store = new Store({
  encryptionKey: 'brave-clone-encryption-key'
});

class BraveBrowserClone {
  constructor() {
    this.mainWindow = null;
    this.tabs = new Map();
    this.activeTabId = null;
    this.adsBlocked = 0;
    this.trackersBlocked = 0;
    this.downloads = new Map(); // downloadId -> { state, item, ... }
    this.extensions = [];
    this.setupApp();
  }

  setupApp() {
    // Security settings
    app.setAppUserModelId('com.vyrnix.browser');
    
    // Fix cache permission issues by setting custom cache directory
    const userDataPath = app.getPath('userData');
    app.setPath('sessionData', path.join(userDataPath, 'sessions'));
    app.setPath('cache', path.join(userDataPath, 'cache'));
    
    // App event handlers
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupSecurity();
      this.setupAutoUpdater();
      this.setupIpcHandlers();
      this.createApplicationMenu();
      this.setupDownloadManager();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });
  }

  setupDownloadManager() {
    session.defaultSession.on('will-download', (event, item, webContents) => {
      const id = Date.now() + '-' + Math.random().toString(36).substr(2, 6);
      const download = {
        id,
        url: item.getURL(),
        filename: item.getFilename(),
        state: 'progressing',
        receivedBytes: 0,
        totalBytes: item.getTotalBytes(),
        savePath: item.getSavePath(),
        startTime: Date.now(),
        endTime: null,
        paused: false,
        error: null
      };
      this.downloads.set(id, download);
      this.sendDownloadsUpdate();
      item.on('updated', (event, state) => {
        download.state = state;
        download.receivedBytes = item.getReceivedBytes();
        download.totalBytes = item.getTotalBytes();
        download.paused = item.isPaused();
        this.sendDownloadsUpdate();
      });
      item.on('done', (event, state) => {
        download.state = state;
        download.endTime = Date.now();
        if (state === 'completed') {
          download.savePath = item.getSavePath();
        } else if (state === 'interrupted') {
          download.error = 'interrupted';
        } else if (state === 'cancelled') {
          download.error = 'cancelled';
        }
        this.sendDownloadsUpdate();
      });
    });
  }

  sendDownloadsUpdate() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('downloads-update', Array.from(this.downloads.values()));
    }
  }

  createMainWindow() {
    // Create the main browser window
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      icon: path.join(__dirname, '../../public/icon.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
        sandbox: false
      },
      titleBarStyle: 'hidden',
      frame: false,
      show: false
    });

    // Load the React app
    const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../../build/index.html')}`;
    this.mainWindow.loadURL(startUrl);

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      this.tabs.clear();
    });
  }

  setupSecurity() {
    // Set up Content Security Policy - allow Google Fonts and necessary resources
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
              // Only apply CSP to our own app, not to external websites
        if (details.url.includes('localhost:3000') || details.url.includes('vyrnix')) {
          callback({
            responseHeaders: {
              ...details.responseHeaders,
              'Content-Security-Policy': [
                "default-src 'self' 'unsafe-inline'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data: https:; " +
                "script-src 'self' 'unsafe-inline'; " +
                "connect-src 'self' https: wss: ws:;"
              ]
            }
          });
        } else {
          // Don't modify CSP for external websites
          callback({ responseHeaders: details.responseHeaders });
        }
    });

    // Block ads and trackers
    this.setupAdBlocker();
    
    // Force HTTPS
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      if (details.url.startsWith('http://') && !details.url.includes('localhost')) {
        callback({ redirectURL: details.url.replace('http://', 'https://') });
      } else {
        callback({});
      }
    });
  }

  setupAdBlocker() {
    // Basic ad blocking implementation
    const blockedDomains = [
      'doubleclick.net',
      'googleadservices.com',
      'googlesyndication.com',
      'google-analytics.com',
      'facebook.com/tr',
      'amazon-adsystem.com'
    ];
    const trackerDomains = [
      'google-analytics.com',
      'facebook.com/tr',
      'doubleclick.net',
      'googletagmanager.com',
      'scorecardresearch.com',
      'adservice.google.com',
      'adservice.google.com.eg',
      'adservice.google.com.sa',
      'adservice.google.com.kw',
      'adservice.google.com.qa',
      'adservice.google.com.bh',
      'adservice.google.com.om',
      'adservice.google.com.lb',
      'adservice.google.com.jo',
      'adservice.google.com.ps',
      'adservice.google.com.ly',
      'adservice.google.com.tn',
      'adservice.google.com.dz',
      'adservice.google.com.ma',
      'adservice.google.com.tr',
      'adservice.google.com.pk',
      'adservice.google.com.in',
      'adservice.google.com.bd',
      'adservice.google.com.lk',
      'adservice.google.com.np',
      'adservice.google.com.af',
      'adservice.google.com.ir',
      'adservice.google.com.iq',
      'adservice.google.com.sy',
      'adservice.google.com.eg',
      'adservice.google.com.sd',
      'adservice.google.com.ss',
      'adservice.google.com.td',
      'adservice.google.com.ne',
      'adservice.google.com.ml',
      'adservice.google.com.sn',
      'adservice.google.com.mr',
      'adservice.google.com.gn',
      'adservice.google.com.ci',
      'adservice.google.com.bf',
      'adservice.google.com.tg',
      'adservice.google.com.bj',
      'adservice.google.com.ng',
      'adservice.google.com.cm',
      'adservice.google.com.ga',
      'adservice.google.com.cg',
      'adservice.google.com.cd',
      'adservice.google.com.ao',
      'adservice.google.com.mz',
      'adservice.google.com.zw',
      'adservice.google.com.na',
      'adservice.google.com.bw',
      'adservice.google.com.za',
      'adservice.google.com.ls',
      'adservice.google.com.sz',
      'adservice.google.com.mg',
      'adservice.google.com.mu',
      'adservice.google.com.sc',
      'adservice.google.com.re',
      'adservice.google.com.yt',
      'adservice.google.com.km',
      'adservice.google.com.pm',
      'adservice.google.com.tf',
      'adservice.google.com.wf',
      'adservice.google.com.nc',
      'adservice.google.com.pf',
      'adservice.google.com.vu',
      'adservice.google.com.sb',
      'adservice.google.com.fj',
      'adservice.google.com.ws',
      'adservice.google.com.to',
      'adservice.google.com.ki',
      'adservice.google.com.tv',
      'adservice.google.com.nr',
      'adservice.google.com.fm',
      'adservice.google.com.mh',
      'adservice.google.com.pw',
      'adservice.google.com.mp',
      'adservice.google.com.gu',
      'adservice.google.com.as',
      'adservice.google.com.ck',
      'adservice.google.com.nu',
      'adservice.google.com.tk',
      'adservice.google.com.to',
      'adservice.google.com.ws',
      'adservice.google.com.sb',
      'adservice.google.com.fj',
      'adservice.google.com.ws',
      'adservice.google.com.to',
      'adservice.google.com.ki',
      'adservice.google.com.tv',
      'adservice.google.com.nr',
      'adservice.google.com.fm',
      'adservice.google.com.mh',
      'adservice.google.com.pw',
      'adservice.google.com.mp',
      'adservice.google.com.gu',
      'adservice.google.com.as',
      'adservice.google.com.ck',
      'adservice.google.com.nu',
      'adservice.google.com.tk',
      'googletagservices.com',
      'scorecardresearch.com',
      'quantserve.com',
      'adnxs.com',
      'criteo.com',
      'rubiconproject.com',
      'openx.net',
      'pubmatic.com',
      'adsafeprotected.com',
      'moatads.com',
      'adform.net',
      'advertising.com',
      'outbrain.com',
      'taboola.com',
      'zedo.com',
      'exelator.com',
      'bluekai.com',
      'mathtag.com',
      'bidswitch.net',
      'casalemedia.com',
      'contextweb.com',
      'lijit.com',
      'media.net',
      'serving-sys.com',
      'simpli.fi',
      'spotxchange.com',
      'teads.tv',
      'tradedoubler.com',
      'turn.com',
      'yahoo.com',
      'yieldmo.com',
      'yieldoptimizer.com',
      'yldbt.com',
      'yldmgrimg.net',
      'yoc.com',
      'zeotap.com'
    ];

    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      const url = details.url.toLowerCase();
      const isAd = blockedDomains.some(domain => url.includes(domain));
      const isTracker = trackerDomains.some(domain => url.includes(domain));
      let blocked = false;
      if (isAd) {
        this.adsBlocked++;
        blocked = true;
      }
      if (isTracker) {
        this.trackersBlocked++;
        blocked = true;
      }
      if (blocked) {
        if (this.mainWindow) {
          this.mainWindow.webContents.send('block-stats', {
            adsBlocked: this.adsBlocked,
            trackersBlocked: this.trackersBlocked
          });
        }
        callback({ cancel: true });
      } else {
        callback({});
      }
    });
  }

  setupAutoUpdater() {
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
      
      autoUpdater.on('update-available', () => {
        dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'Update Available',
          message: 'A new version is available. It will be downloaded in the background.',
          buttons: ['OK']
        });
      });
    }
  }

  setupIpcHandlers() {
    // Tab management
    ipcMain.handle('create-tab', async (event, url = 'https://www.google.com') => {
      return this.createTab(url);
    });

    ipcMain.handle('close-tab', async (event, tabId) => {
      return this.closeTab(tabId);
    });

    ipcMain.handle('switch-tab', async (event, tabId) => {
      return this.switchTab(tabId);
    });

    ipcMain.handle('navigate-tab', async (event, tabId, url) => {
      return this.navigateTab(tabId, url);
    });

    // Bookmarks management
    ipcMain.handle('get-bookmarks', async () => {
      return store.get('bookmarks', []);
    });

    ipcMain.handle('add-bookmark', async (event, bookmark) => {
      const bookmarks = store.get('bookmarks', []);
      bookmarks.push({ ...bookmark, id: Date.now() });
      store.set('bookmarks', bookmarks);
      return bookmarks;
    });

    ipcMain.handle('remove-bookmark', async (event, bookmarkId) => {
      const bookmarks = store.get('bookmarks', []);
      const filtered = bookmarks.filter(b => b.id !== bookmarkId);
      store.set('bookmarks', filtered);
      return filtered;
    });

    // History management
    ipcMain.handle('get-history', async () => {
      return store.get('history', []);
    });

    ipcMain.handle('add-history', async (event, historyItem) => {
      const history = store.get('history', []);
      history.unshift({ ...historyItem, timestamp: Date.now() });
      // Keep only last 1000 items
      const trimmed = history.slice(0, 1000);
      store.set('history', trimmed);
      return trimmed;
    });

    ipcMain.handle('clear-history', async () => {
      store.set('history', []);
      return [];
    });

    // Settings management
    ipcMain.handle('get-settings', async () => {
      return store.get('settings', {
        theme: 'light',
        searchEngine: 'google',
        adBlockEnabled: true,
        httpsOnlyMode: true,
        showBookmarksBar: true
      });
    });

    ipcMain.handle('update-settings', async (event, settings) => {
      store.set('settings', settings);
      return settings;
    });

    // Window controls
    ipcMain.handle('window-minimize', () => {
      this.mainWindow.minimize();
    });

    ipcMain.handle('window-maximize', () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    });

    ipcMain.handle('window-close', () => {
      this.mainWindow.close();
    });

    // External links
    ipcMain.handle('open-external', async (event, url) => {
      shell.openExternal(url);
    });

    // Navigation controls
    ipcMain.handle('go-back', async (event, tabId) => {
      return this.goBack(tabId);
    });

    ipcMain.handle('go-forward', async (event, tabId) => {
      return this.goForward(tabId);
    });

    ipcMain.handle('refresh', async (event, tabId) => {
      return this.refresh(tabId);
    });

    ipcMain.handle('can-go-back', async (event, tabId) => {
      const tab = this.tabs.get(tabId);
      return tab && tab.view ? tab.view.webContents.canGoBack() : false;
    });

    ipcMain.handle('can-go-forward', async (event, tabId) => {
      const tab = this.tabs.get(tabId);
      return tab && tab.view ? tab.view.webContents.canGoForward() : false;
    });

    ipcMain.handle('get-block-stats', async () => {
      return {
        adsBlocked: this.adsBlocked,
        trackersBlocked: this.trackersBlocked
      };
    });

    ipcMain.handle('get-downloads', async () => {
      return Array.from(this.downloads.values());
    });
    ipcMain.handle('pause-download', async (event, id) => {
      const download = this.downloads.get(id);
      if (download && download.item && !download.paused) {
        download.item.pause();
      }
    });
    ipcMain.handle('resume-download', async (event, id) => {
      const download = this.downloads.get(id);
      if (download && download.item && download.paused) {
        download.item.resume();
      }
    });
    ipcMain.handle('cancel-download', async (event, id) => {
      const download = this.downloads.get(id);
      if (download && download.item) {
        download.item.cancel();
      }
    });
    ipcMain.handle('open-download', async (event, id) => {
      const download = this.downloads.get(id);
      if (download && download.savePath) {
        shell.openPath(download.savePath);
      }
    });
    ipcMain.handle('clear-downloads', async () => {
      this.downloads.clear();
      this.sendDownloadsUpdate();
    });

    // Extension management
    ipcMain.handle('load-unpacked-extension', async () => {
      try {
        const result = await dialog.showOpenDialog({
          title: 'Select Extension Folder',
          properties: ['openDirectory']
        });
        if (result.canceled || !result.filePaths || !result.filePaths[0]) {
          return null;
        }
        const ext = await session.defaultSession.loadExtension(result.filePaths[0], { allowFileAccess: true });
        // Store loaded extension info
        this.extensions.push({
          id: ext.id,
          name: ext.name,
          version: ext.version,
          path: ext.path,
          manifest: ext.manifest,
          enabled: true
        });
        return { name: ext.name, version: ext.version, id: ext.id };
      } catch (e) {
        return { error: e.message };
      }
    });
    ipcMain.handle('get-loaded-extensions', async () => {
      return this.extensions;
    });
    ipcMain.handle('enable-extension', async (event, extId) => {
      const ext = this.extensions.find(e => e.id === extId);
      if (ext && !ext.enabled) {
        try {
          await session.defaultSession.loadExtension(ext.path, { allowFileAccess: true });
          ext.enabled = true;
          return { success: true };
        } catch (e) {
          return { error: e.message };
        }
      }
      return { success: false };
    });
    ipcMain.handle('disable-extension', async (event, extId) => {
      const ext = this.extensions.find(e => e.id === extId);
      if (ext && ext.enabled) {
        try {
          await session.defaultSession.removeExtension(extId);
          ext.enabled = false;
          return { success: true };
        } catch (e) {
          return { error: e.message };
        }
      }
      return { success: false };
    });
    ipcMain.handle('remove-extension', async (event, extId) => {
      const extIndex = this.extensions.findIndex(e => e.id === extId);
      if (extIndex !== -1) {
        try {
          await session.defaultSession.removeExtension(extId);
        } catch (e) {
          // Ignore error if already removed
        }
        this.extensions.splice(extIndex, 1);
        return { success: true };
      }
      return { success: false };
    });
  }

  async createTab(url = null) {
    // Defensive: if url is null/empty, use about:blank
    const safeUrl = url && typeof url === 'string' && url.trim() ? url : 'about:blank';
    const tabId = Date.now().toString();
    
    // If no URL provided, create a tab without browser view (for home screen)
    if (!url || url === null || url === undefined) {
      this.tabs.set(tabId, {
        view: null,
        url: null,
        title: 'New Tab',
        favicon: null,
        isLoading: false
      });
      
      // Switch to this tab
      this.switchTab(tabId);
      
      console.log(`[createTab] Created home tab: tabId=${tabId}`);
      return { tabId, url: null, title: 'New Tab' };
    }
    
    const tabView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        allowRunningInsecureContent: false
      }
    });

    this.tabs.set(tabId, {
      view: tabView,
      url: url,
      title: 'Loading...',
      favicon: null,
      isLoading: true
    });

    // Load the URL
    if (!tabView || !tabView.webContents) {
      console.error('[createTab] tabView or webContents missing for tabId', tabId);
      return;
    }
    console.log(`[createTab] Loading URL: ${safeUrl} in tabId=${tabId}`);
    tabView.webContents.loadURL(safeUrl).catch(error => {
      console.error('[createTab] Failed to load URL:', safeUrl, error);
    });

    // Tab event handlers
    tabView.webContents.on('did-finish-load', () => {
      const tab = this.tabs.get(tabId);
      if (tab) {
        tab.isLoading = false;
        tab.title = tabView.webContents.getTitle();
        // Send only serializable data, not the view object
        const serializableTab = {
          url: tab.url,
          title: tab.title,
          favicon: tab.favicon,
          isLoading: tab.isLoading
        };
        this.mainWindow.webContents.send('tab-updated', tabId, serializableTab);
      }
      console.log(`[createTab] Finished loading tabId=${tabId}`);
    });

    tabView.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error(`[createTab] Tab failed to load: tabId=${tabId}, error=${errorDescription}`);
    });

    tabView.webContents.on('new-window', (event, navigationUrl) => {
      event.preventDefault();
      this.createTab(navigationUrl);
    });

    // Always switch to the new tab after creation
    this.switchTab(tabId);
    console.log(`[createTab] Switched to new tabId=${tabId}`);
    return { tabId, url, title: 'Loading...' };
  }

  closeTab(tabId) {
    const tab = this.tabs.get(tabId);
    if (tab) {
      if (this.activeTabId === tabId) {
        // Remove browser view if it exists
        if (tab.view) {
          this.mainWindow.removeBrowserView(tab.view);
        }
        
        // Switch to another tab or create new one
        const remainingTabs = Array.from(this.tabs.keys()).filter(id => id !== tabId);
        if (remainingTabs.length > 0) {
          this.switchTab(remainingTabs[0]);
        } else {
          this.activeTabId = null;
        }
      }
      
      // Destroy the tab view if it exists
      if (tab.view && tab.view.webContents && !tab.view.webContents.isDestroyed()) {
        tab.view.webContents.destroy();
      }
      this.tabs.delete(tabId);
      return true;
    }
    return false;
  }

  async switchTab(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab || !tab.view || !tab.view.webContents) {
      console.error('[switchTab] Tab, view, or webContents not found for tabId', tabId);
      return;
    }
    if (this.mainWindow) {
      this.mainWindow.setBrowserView(tab.view);
      // Set bounds to fill the window below the title bar (assume 64px title bar)
      const [width, height] = this.mainWindow.getContentSize();
      tab.view.setBounds({ x: 0, y: 64, width, height: height - 64 });
      tab.view.setAutoResize({ width: true, height: true });
      console.log(`[switchTab] Set BrowserView for tabId=${tabId} with bounds w=${width} h=${height}`);
    }
  }

  async navigateTab(tabId, url) {
    // Defensive: if url is null/empty, use about:blank
    const safeUrl = url && typeof url === 'string' && url.trim() ? url : 'about:blank';
    const tab = this.tabs.get(tabId);
    if (!tab || !tab.view || !tab.view.webContents) {
      console.error('[navigateTab] Tab, view, or webContents not found for tabId', tabId);
      return;
    }
    console.log(`[navigateTab] Navigating tabId=${tabId} to url=${safeUrl}`);
    tab.view.webContents.loadURL(safeUrl).catch(error => {
      console.error('[navigateTab] Failed to load URL:', safeUrl, error);
    });
  }

  async goBack(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab || !tab.view || !tab.view.webContents) {
      console.error('goBack: Tab, view, or webContents not found for tabId', tabId);
      return;
    }
    if (tab.view.webContents.canGoBack()) {
      tab.view.webContents.goBack();
    }
  }

  async goForward(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab || !tab.view || !tab.view.webContents) {
      console.error('goForward: Tab, view, or webContents not found for tabId', tabId);
      return;
    }
    if (tab.view.webContents.canGoForward()) {
      tab.view.webContents.goForward();
    }
  }

  async refresh(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab || !tab.view || !tab.view.webContents) {
      console.error('refresh: Tab, view, or webContents not found for tabId', tabId);
      return;
    }
    tab.view.webContents.reload();
  }

  createApplicationMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Tab',
            accelerator: 'CmdOrCtrl+T',
            click: () => {
              this.mainWindow.webContents.send('new-tab');
            }
          },
          {
            label: 'New Incognito Window',
            accelerator: 'CmdOrCtrl+Shift+N',
            click: () => {
              // TODO: Implement incognito mode
            }
          },
          { type: 'separator' },
          {
            label: 'Exit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'actualSize' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About Brave Clone',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                title: 'About Brave Clone',
                message: 'Brave Browser Clone v1.0.0',
                detail: 'A privacy-focused browser built with Electron and React.'
              });
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

// Initialize the browser
new BraveBrowserClone(); 