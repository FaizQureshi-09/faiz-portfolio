import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio-theme';

/** Reads the theme already applied to <html> by index.html's inline bootstrap script. */
function getInitialTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

/**
 * Manages the site's light/dark theme: tracks the active theme, applies it
 * to <html data-theme> so CSS variables in variables.css pick it up, and
 * persists the choice across visits.
 *
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) => (previousTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
