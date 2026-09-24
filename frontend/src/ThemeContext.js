import React, { createContext, useState, useEffect } from 'react';

// Context එක සෑදීම
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Local storage එකෙන් දැනට තියෙන theme එක කියවීම
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Theme එක වෙනස් වෙන හැම වෙලාවකම local storage එක update කිරීම
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Theme එක මාරු කරන function එක
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};