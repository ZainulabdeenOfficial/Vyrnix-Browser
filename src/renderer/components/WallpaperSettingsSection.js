import React, { useState, useEffect, useRef } from 'react';

export const WALLPAPER_KEY = 'vyrnix-wallpapers';
export const WALLPAPER_INDEX_KEY = 'vyrnix-wallpaper-index';
export const WALLPAPER_INTERVAL_KEY = 'vyrnix-wallpaper-interval';

const WallpaperSettingsSection = () => {
  const [wallpapers, setWallpapers] = useState([]); // Array of { id, url, name }
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const intervalRef = useRef();

  // Load wallpapers and settings from localStorage
  useEffect(() => {
    const savedWallpapers = localStorage.getItem(WALLPAPER_KEY);
    const savedIndex = localStorage.getItem(WALLPAPER_INDEX_KEY);
    const savedInterval = localStorage.getItem(WALLPAPER_INTERVAL_KEY);
    if (savedWallpapers) {
      try {
        setWallpapers(JSON.parse(savedWallpapers));
      } catch {}
    }
    if (savedIndex) setCurrentWallpaperIndex(Number(savedIndex));
    if (savedInterval) setIntervalMinutes(Number(savedInterval));
  }, []);

  // Save wallpapers and settings to localStorage
  useEffect(() => {
    localStorage.setItem(WALLPAPER_KEY, JSON.stringify(wallpapers));
  }, [wallpapers]);
  useEffect(() => {
    localStorage.setItem(WALLPAPER_INDEX_KEY, String(currentWallpaperIndex));
  }, [currentWallpaperIndex]);
  useEffect(() => {
    localStorage.setItem(WALLPAPER_INTERVAL_KEY, String(intervalMinutes));
  }, [intervalMinutes]);

  // Wallpaper rotation timer
  useEffect(() => {
    if (wallpapers.length < 2) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentWallpaperIndex(idx => (idx + 1) % wallpapers.length);
    }, intervalMinutes * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [wallpapers, intervalMinutes]);

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

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
      <div>
        <label className="block text-sm font-medium mb-1">Custom Wallpapers</label>
        <input type="file" accept="image/*" onChange={handleWallpaperUpload} />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {wallpapers.map((wp, idx) => (
          <div key={wp.id} className="relative group">
            <img
              src={wp.url}
              alt={wp.name}
              className={`w-16 h-10 object-cover rounded border-2 ${idx === currentWallpaperIndex ? 'border-vyrnix-primary' : 'border-transparent'} cursor-pointer`}
              onClick={() => handleSetWallpaper(idx)}
              title={wp.name}
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
              onClick={() => handleRemoveWallpaper(wp.id)}
              title="Remove"
            >×</button>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Change Interval (minutes)</label>
        <input
          type="number"
          min={1}
          max={120}
          value={intervalMinutes}
          onChange={e => setIntervalMinutes(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};

export default WallpaperSettingsSection; 