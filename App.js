import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import MainStackNavigator from "./navigation/MainStackNavigator";

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <MainStackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
