import * as React from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./context/UserContext";
import MainStackNavigator from "./navigation/MainStackNavigator";
import { createPaperTheme } from "./theme/paperTheme";

export default function App() {
  const scheme = useColorScheme();
  const paperTheme = createPaperTheme(scheme);

  return (
    <UserProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <MainStackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}
