import React, { useState, useEffect } from 'react';

const ExtensionsPage = () => {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // { [id]: true/false }

  // Fetch loaded extensions on mount
  const fetchExtensions = () => {
    if (window.electronAPI && window.electronAPI.getLoadedExtensions) {
      window.electronAPI.getLoadedExtensions().then(setExtensions);
    }
  };
  useEffect(() => {
    fetchExtensions();
  }, []);

  // Handler to open Chrome Web Store in a new tab
  const handleOpenWebStore = () => {
    if (window.electronAPI && window.electronAPI.createTab) {
      window.electronAPI.createTab('https://chrome.google.com/webstore/category/extensions');
    } else {
      window.open('https://chrome.google.com/webstore/category/extensions', '_blank');
    }
  };

  // Handler to load unpacked extension (folder picker)
  const handleLoadUnpacked = async () => {
    setError(null);
    setLoading(true);
    try {
      if (window.electronAPI && window.electronAPI.loadUnpackedExtension) {
        const ext = await window.electronAPI.loadUnpackedExtension();
        if (ext && !ext.error) {
          fetchExtensions();
        } else if (ext && ext.error) {
          setError('Failed to load extension: ' + ext.error);
        }
      } else {
        setError('Extension loading not yet implemented.');
      }
    } catch (e) {
      setError('Failed to load extension: ' + e.message);
    }
    setLoading(false);
  };

  // Enable extension
  const handleEnable = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setError(null);
    try {
      const res = await window.electronAPI.enableExtension(id);
      if (res && res.error) setError('Enable failed: ' + res.error);
      fetchExtensions();
    } catch (e) {
      setError('Enable failed: ' + e.message);
    }
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  // Disable extension
  const handleDisable = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setError(null);
    try {
      const res = await window.electronAPI.disableExtension(id);
      if (res && res.error) setError('Disable failed: ' + res.error);
      fetchExtensions();
    } catch (e) {
      setError('Disable failed: ' + e.message);
    }
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  // Remove extension
  const handleRemove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setError(null);
    try {
      const res = await window.electronAPI.removeExtension(id);
      if (res && res.error) setError('Remove failed: ' + res.error);
      fetchExtensions();
    } catch (e) {
      setError('Remove failed: ' + e.message);
    }
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Extensions</h3>
      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          onClick={handleOpenWebStore}
        >
          Open Chrome Web Store
        </button>
        <button
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
          onClick={handleLoadUnpacked}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Unpacked Extension'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div>
        <h4 className="font-semibold mb-2">Installed Extensions</h4>
        {extensions.length === 0 ? (
          <p className="text-sm text-vyrnix-gray-500">No extensions loaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {extensions.map((ext, idx) => (
              <li key={ext.id || idx} className="p-2 bg-vyrnix-gray-100 rounded flex items-center gap-2">
                <span className="font-medium">{ext.name || 'Extension'}</span>
                <span className="text-xs text-vyrnix-gray-500">{ext.version}</span>
                <span className={`text-xs px-2 py-1 rounded ${ext.enabled ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {ext.enabled ? 'Enabled' : 'Disabled'}
                </span>
                {ext.enabled ? (
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    onClick={() => handleDisable(ext.id)}
                    disabled={actionLoading[ext.id]}
                  >
                    {actionLoading[ext.id] ? 'Disabling...' : 'Disable'}
                  </button>
                ) : (
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={() => handleEnable(ext.id)}
                    disabled={actionLoading[ext.id]}
                  >
                    {actionLoading[ext.id] ? 'Enabling...' : 'Enable'}
                  </button>
                )}
                <button
                  className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => handleRemove(ext.id)}
                  disabled={actionLoading[ext.id]}
                >
                  {actionLoading[ext.id] ? 'Removing...' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6 text-xs text-vyrnix-gray-400">
        <p>Note: Only unpacked extensions are supported. Direct install from Chrome Web Store is not available in Electron.</p>
      </div>
    </div>
  );
};

export default ExtensionsPage; 