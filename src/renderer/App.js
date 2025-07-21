import React, { useState, useEffect } from 'react';
import { BrowserProvider } from './contexts/BrowserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import BrowserInterface from './components/BrowserInterface';

function App() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if we're running in Electron
    setIsElectron(typeof window.electronAPI !== 'undefined');
  }, []);

  if (!isElectron) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Vyrnix Browser
          </h1>
          <p className="text-gray-600">
            This application must be run as an Electron app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserProvider>
        <div className="h-screen w-screen overflow-hidden">
          <BrowserInterface />
        </div>
      </BrowserProvider>
    </ThemeProvider>
  );
}

export default App; 