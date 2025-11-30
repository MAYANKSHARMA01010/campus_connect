import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomNavigationMainScreen from "./BottomNavigationMainScreen";
import HostEventScreen from "../Screens/HostEventScreen";
import ManageEventsScreen from "../Screens/ManageEvents";
import EventDetail from "../Screens/EventDetail";
import EventPreviewScreen from "../Screens/EventPreviewScreen";

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="MainTabs" 
        component={BottomNavigationMainScreen} 
      />
      <Stack.Screen 
        name="HostEvent" 
        component={HostEventScreen} 
      />
      <Stack.Screen
        name="ManageEvents"
        component={ManageEventsScreen}
      />
      <Stack.Screen
        name="EventPreview"
        component={EventPreviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
