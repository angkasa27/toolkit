"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const storageKey = "theme";
const themeChangeEvent = "kartu-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function storedTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const value = window.localStorage.getItem(storageKey);
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

function applyTheme(theme: Theme, resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;
  const activeTheme = theme === "system" ? resolvedTheme : theme;
  root.classList.toggle("dark", activeTheme === "dark");
  root.style.colorScheme = activeTheme;
}

function themeSnapshot() {
  return `${storedTheme()}:${systemTheme()}`;
}

function serverThemeSnapshot() {
  return "system:light";
}

function subscribeToThemeStore(onStoreChange: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(themeChangeEvent, onStoreChange);
  query.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(themeChangeEvent, onStoreChange);
    query.removeEventListener("change", onStoreChange);
  };
}

/** App-wide light/dark/system theme provider without client-rendered scripts. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToThemeStore,
    themeSnapshot,
    serverThemeSnapshot,
  );

  const [theme, systemResolvedTheme] = snapshot.split(":") as [
    Theme,
    ResolvedTheme,
  ];

  const setTheme = useCallback((nextTheme: Theme) => {
    window.localStorage.setItem(storageKey, nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  useEffect(() => {
    applyTheme(theme, systemResolvedTheme);
  }, [theme, systemResolvedTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme === "system" ? systemResolvedTheme : theme,
      setTheme,
    }),
    [theme, systemResolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
