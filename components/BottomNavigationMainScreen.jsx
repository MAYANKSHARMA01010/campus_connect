import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../Screens/Home';
import EventScreen from '../Screens/Events';
import ProfileScreen from '../Screens/Profile';
import SearchScreen from '../Screens/Search';

const Tabs = createBottomTabNavigator();

export default function BottomNavigationMainScreen() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Events" component={EventScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
      <Tabs.Screen name="Search" component={SearchScreen} />
    </Tabs.Navigator>
  );
}
