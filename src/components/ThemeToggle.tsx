import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-0.5">
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white dark:bg-gray-900">
          <FontAwesomeIcon 
            icon={theme === 'dark' ? faSun : faMoon} 
            className={`h-4 w-4 transition-all duration-300 ${
              theme === 'dark' 
                ? 'text-yellow-500 rotate-0' 
                : 'text-gray-700 rotate-0'
            }`}
          />
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-110 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 transition-transform duration-300"></div>
    </button>
  );
};

export default ThemeToggle;