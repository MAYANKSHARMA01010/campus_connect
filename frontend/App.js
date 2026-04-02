import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider, useThemeMode } from "./context/ThemeContext";
import MainStackNavigator from "./navigation/MainStackNavigator";
import { createPaperTheme } from "./theme/paperTheme";
import { Colors } from "./theme/theme";

function AppShell() {
  const { isDark } = useThemeMode();
  const paperTheme = createPaperTheme(isDark ? "dark" : "light");
  const appColors = isDark ? Colors.dark : Colors.light;

  const navigationTheme = {
    ...(isDark ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...(isDark ? NavigationDarkTheme : NavigationDefaultTheme)
        .colors,
      background: appColors.background,
      card: appColors.surface,
      text: appColors.textPrimary,
      border: appColors.border,
      primary: appColors.primary,
      notification: appColors.accent,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <MainStackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </UserProvider>
  );
}
