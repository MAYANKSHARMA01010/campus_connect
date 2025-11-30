import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../theme/useAppTheme";

import BottomNavigationMainScreen from "./BottomNavigationMainScreen";
import HostEventScreen from "../Screens/HostEventScreen";
import ManageEventsScreen from "../Screens/ManageEvents";
import EventDetail from "../Screens/EventDetail";
import EventPreviewScreen from "../Screens/EventPreviewScreen";

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  const colors = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomNavigationMainScreen} />
      <Stack.Screen name="HostEvent" component={HostEventScreen} />
      <Stack.Screen name="ManageEvents" component={ManageEventsScreen} />
      <Stack.Screen name="EventPreview" component={EventPreviewScreen} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
}
