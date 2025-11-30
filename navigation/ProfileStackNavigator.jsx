import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts } from "../theme/theme";

import ProfileScreen from "../Screens/Profile";
import EditProfileScreen from "../Screens/EditProfileScreen.jsx";

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  const colors = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: Fonts.weight.semiBold,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
}
