import * as React from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { UserProvider } from "./context/UserContext";
import MainStackNavigator from "./navigation/MainStackNavigator";
import { createPaperTheme } from "./theme/paperTheme";
import { Colors } from "./theme/theme";

export default function App() {
  const scheme = useColorScheme();
  const paperTheme = createPaperTheme(scheme);
  const appColors = scheme === "dark" ? Colors.dark : Colors.light;

  const navigationTheme = {
    ...(scheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...(scheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme)
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
    <UserProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          <MainStackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}
