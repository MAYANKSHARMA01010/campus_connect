import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_MODE_KEY = "themeMode";

const ThemeContext = createContext({
  themeMode: "light",
  isDark: false,
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState("light");

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (stored === "light" || stored === "dark") {
          setThemeModeState(stored);
        }
      } catch (err) {
        console.log("Theme init failed:", err);
      }
    };

    loadThemeMode();
  }, []);

  const setThemeMode = useCallback(async (mode) => {
    if (mode !== "light" && mode !== "dark") return;

    setThemeModeState(mode);

    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    } catch (err) {
      console.log("Theme save failed:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      themeMode,
      isDark: themeMode === "dark",
      setThemeMode,
    }),
    [themeMode, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
