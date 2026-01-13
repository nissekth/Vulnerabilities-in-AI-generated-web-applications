import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { userProfile } = useAuth();
  const [theme, setTheme] = useState('default');
  const [colorScheme, setColorScheme] = useState('rose');

  useEffect(() => {
    if (userProfile) {
      setTheme(userProfile.theme || 'default');
      setColorScheme(userProfile.colorScheme || 'rose');
    }
  }, [userProfile]);

  const themes = {
    default: {
      name: 'Modern Light',
      bg: 'bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50'
    },
    dark: {
      name: 'Dark Mode',
      bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    },
    ocean: {
      name: 'Ocean Breeze',
      bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50'
    },
    sunset: {
      name: 'Sunset Glow',
      bg: 'bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100'
    },
    forest: {
      name: 'Forest Green',
      bg: 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50'
    }
  };

  const colorSchemes = {
    rose: 'from-rose-500 to-pink-600',
    purple: 'from-purple-500 to-indigo-600',
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-red-600'
  };

  const value = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    themes,
    colorSchemes,
    currentTheme: themes[theme] || themes.default,
    currentColorScheme: colorSchemes[colorScheme] || colorSchemes.rose
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
