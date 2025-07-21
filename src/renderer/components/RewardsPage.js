import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RewardsPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="p-8">
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>Vyrnix Rewards</h2>
      <div className={`p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-6 ${isDark ? 'bg-vyrnix-gray-800' : 'bg-white'}`}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-vyrnix-primary flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>Earn Vyrnix Tokens</div>
          <div className="text-sm text-vyrnix-gray-500 mb-4">Earn tokens by viewing privacy-respecting ads and supporting creators.</div>
          <button className="px-6 py-2 rounded-lg bg-yellow-400 text-vyrnix-gray-900 font-medium hover:bg-yellow-300 transition">Enable Rewards</button>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage; 