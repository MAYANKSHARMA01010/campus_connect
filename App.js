import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./context/UserContext";
import MainStackNavigator from "./navigation/MainStackNavigator";

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <MainStackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}
