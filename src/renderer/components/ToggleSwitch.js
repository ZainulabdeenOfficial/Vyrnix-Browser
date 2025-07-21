import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ToggleSwitch = ({ enabled, onToggle, label, description, disabled = false }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-vyrnix-gray-800'}`}>
          {label}
        </label>
        {description && (
          <p className={`text-xs mt-1 ${isDark ? 'text-vyrnix-gray-400' : 'text-vyrnix-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-vyrnix-primary focus:ring-offset-2
          ${isDark ? 'focus:ring-offset-vyrnix-gray-800' : 'focus:ring-offset-white'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${enabled 
            ? 'bg-vyrnix-primary shadow-lg shadow-vyrnix-primary/30' 
            : isDark 
              ? 'bg-vyrnix-gray-700' 
              : 'bg-vyrnix-gray-300'
          }
        `}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out
            ${enabled ? 'translate-x-6 scale-110' : 'translate-x-1 scale-100'}
          `}
        >
          {/* Inner indicator dot */}
          <span className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-1.5 h-1.5 rounded-full transition-colors duration-300
            ${enabled ? 'bg-vyrnix-primary' : isDark ? 'bg-vyrnix-gray-600' : 'bg-vyrnix-gray-400'}
          `} />
        </span>
      </button>
    </div>
  );
};

export default ToggleSwitch; 