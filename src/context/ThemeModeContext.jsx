import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme/theme';

const STORAGE_KEY = 'belleza-theme-mode';

const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
  setMode: () => {},
});

const readStoredMode = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    // localStorage no disponible: se usa el valor por defecto
  }
  return 'light';
};

export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState(readStoredMode);

  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // ignore
    }
  };

  const setMode = useCallback((next) => {
    const normalized = next === 'dark' ? 'dark' : 'light';
    setModeState(normalized);
    persist(normalized);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persist(next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggleMode, setMode }), [mode, toggleMode, setMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeModeContext);

export default ThemeModeContext;
