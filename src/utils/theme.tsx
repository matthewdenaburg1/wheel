import { useState, useEffect } from 'react';

const DARK_THEME = 'dark-mode';
const LIGHT_THEME = 'light-mode';

export const useTheme = (): [string, () => void] => {
  const [theme, setTheme] = useState(LIGHT_THEME);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setTheme(DARK_THEME);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME));
  };

  return [theme, toggleTheme];
};
