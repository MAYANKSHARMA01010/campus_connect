import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import HomeScreen from '../Screens/Home';
import EventScreen from '../Screens/Events';
import ProfileScreen from '../Screens/Profile';
import SearchScreen from '../Screens/Search';
import AuthStackNavigator from './AuthStackNavigator';
import { useAuth } from '../context/AuthContext';

const Tabs = createBottomTabNavigator();

export default function BottomNavigationMainScreen() {
  const { isLoggedIn } = useAuth();

  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#E91E63',
        tabBarInactiveTintColor: '#555',
      }}>
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="Events"
        component={EventScreen}
        options={{ tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name={isLoggedIn ? 'Profile' : 'Login'}
        component={isLoggedIn ? ProfileScreen : AuthStackNavigator}
        options={{ tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={24} color={color} /> }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    borderRadius: 20,
    height: 65,
    backgroundColor: '#fff',
    elevation: 5,
  },
});
