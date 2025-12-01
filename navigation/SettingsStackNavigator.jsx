import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts } from "../theme/theme";

import SettingsScreen from "../Screens/SettingsScreen";
import ProfileScreen from "../Screens/Profile";
import ManageEvents from "../Screens/ManageEvents";
import MyEvents from "../Screens/MyEvents";

const Stack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  const colors = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: Fonts.weight.semiBold,
        },
      }}
    >
      
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />

      <Stack.Screen
        name="ManageEvents"
        component={ManageEvents}
        options={{ title: "Manage Events",headerShown: false }}
      />

      <Stack.Screen
        name="MyEvents"
        component={MyEvents}
        options={{ title: "My Events" }}
      />
    </Stack.Navigator>
  );
}
