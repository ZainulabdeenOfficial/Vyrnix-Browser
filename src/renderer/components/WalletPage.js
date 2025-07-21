import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const WalletPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="p-8">
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>Crypto Wallet</h2>
      <div className={`p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-6 ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white'}`}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vyrnix-primary to-blue-400 flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" /></svg>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>Web3 Wallet Coming Soon</div>
          <div className="text-sm text-vyrnix-gray-500 mb-4">Manage your crypto assets, view balances, and connect to dApps.</div>
          <button className="px-6 py-2 rounded-lg bg-vyrnix-primary text-white font-medium hover:bg-vyrnix-primary/80 transition">Connect Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage; 