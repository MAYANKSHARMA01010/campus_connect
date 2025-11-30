import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../Screens/SettingsScreen";
import ProfileScreen from "../Screens/Profile";
import ChangePassword from "../Screens/ChangePassword";
import ManageEvents from "../Screens/ManageEvents";

const Stack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ManageEvents" component={ManageEvents} />
        </Stack.Navigator>
    );
}
