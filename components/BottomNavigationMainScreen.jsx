import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  Entypo,
  Ionicons,
  MaterialIcons,
  FontAwesome6,
} from '@expo/vector-icons'; 

import HomeScreen from '../Screens/Home';
import EventScreen from '../Screens/Events';
import ProfileScreen from '../Screens/Profile';
import SearchScreen from '../Screens/Search';

const Tabs = createBottomTabNavigator();

export default function BottomNavigationMainScreen() {
  return (
    <Tabs.Navigator>

      <Tabs.Screen
        options={{
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
          tabBarIconStyle: { marginRight: 2 },
        }}
        name="Home" component={HomeScreen} 
      />

      <Tabs.Screen
        options={{
          tabBarIcon: () => <Ionicons name="search" size={24} color="black" />,
          tabBarIconStyle: { marginRight: 3 },
        }}
        name="Search" component={SearchScreen} 
      />

      <Tabs.Screen 
        options={{
          tabBarIcon: () => <MaterialIcons name="event" size={24} color="black" />,
          tabBarIconStyle: { marginRight: 2 },
        }}
        name="Events" component={EventScreen} 
      />

      <Tabs.Screen
        options={{
          tabBarIcon: () => <FontAwesome6 name="user" size={24} color="black" />,
          tabBarIconStyle: { marginRight: 2 },
        }}
        name="Profile" component={ProfileScreen} 
      />

    </Tabs.Navigator>
  );
}
