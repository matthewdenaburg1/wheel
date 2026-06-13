import { useState, useEffect } from "react";

export type Theme = 'dark' | 'light';

export function isTheme(value: string): value is Theme {
  return ['light', 'dark', 'light-mode', 'dark-mode'].includes(value.toLowerCase());
}

export function toTheme(value: string | null): Theme {
  if (value === null || !isTheme(value)) {
    return 'dark';
  }

  switch (value?.toLowerCase()) {
    case 'light':
    case 'light-mode':
      return 'light';
    case 'dark':
    case 'dark-mode':
      return 'dark';
    default:
      return 'dark';
  }
}

export const useTheme = (initialTheme: Theme | null = null): [Theme, () => void] => {
  const [theme, setTheme] = useState(initialTheme ?? 'dark');

  useEffect(() => {
    // When an initial theme is provided (e.g. from URL), use it directly
    // and skip the localStorage / system-preference lookup.
    if (initialTheme) {
      return;
    }

    const savedTheme = toTheme(localStorage.getItem('theme'));

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light' ));
  };

  return [theme, toggleTheme];
};
