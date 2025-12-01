import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts } from "../theme/theme";

import SettingsScreen from "../Screens/SettingsScreen";
import ProfileScreen from "../Screens/Profile";
// import ChangePassword from "../Screens/ChangePassword";
import ManageEvents from "../Screens/ManageEvents";

const Stack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  const colors = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: Fonts.weight.semiBold,
        },
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* <Stack.Screen name="ChangePassword" component={ChangePassword} /> */}
      <Stack.Screen name="ManageEvents" component={ManageEvents} />
    </Stack.Navigator>
  );
}
