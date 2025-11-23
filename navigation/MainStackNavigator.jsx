import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigationMainScreen from "./BottomNavigationMainScreen";
import HostEventScreen from "../Screens/HostEventScreen";
import EventDetail from "../Screens/EventDetail";

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomNavigationMainScreen} />
      <Stack.Screen name="HostEvent" component={HostEventScreen} />
      <Stack.Screen name="EventDetail" component={EventDetail} options={{ headerShown: true, title: "Event" }} />
    </Stack.Navigator>
  );
}
