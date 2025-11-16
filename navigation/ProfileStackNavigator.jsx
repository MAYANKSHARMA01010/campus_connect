import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../Screens/Profile";
import EditProfileScreen from "../Screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
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
          headerBackTitle: "Back"
        }}
      />
    </Stack.Navigator>
  );
}
