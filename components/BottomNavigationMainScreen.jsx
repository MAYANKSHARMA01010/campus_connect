import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  Entypo,
  Ionicons,
  MaterialIcons,
  FontAwesome6,
} from '@expo/vector-icons'; 
import { 
  Image, 
  Text, 
  StyleSheet 
} from 'react-native';

import HomeScreen from '../Screens/Home';
import EventScreen from '../Screens/Events';
import ProfileScreen from '../Screens/Profile';
import SearchScreen from '../Screens/Search';

const Tabs = createBottomTabNavigator();

export default function BottomNavigationMainScreen() {
  return (
    <Tabs.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
          headerTitle: () => <Text style={styles.headerTitleText}>Home</Text>,
          headerLeft: () => <Image source={require("../assets/LOGO.png")} style={styles.headerLogo} />,
        }}
      />

      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => <Ionicons name="search" size={24} color="black" />,
          headerTitle: () => <Text style={styles.headerTitleText}>Search</Text>,
          headerLeft: () => <Image source={require("../assets/LOGO.png")} style={styles.headerLogo} />,
        }}
      />

      <Tabs.Screen 
        name="Events"
        component={EventScreen} 
        options={{
          tabBarIcon: () => <MaterialIcons name="event" size={24} color="black" />,
          headerTitle: () => <Text style={styles.headerTitleText}>Events</Text>,
          headerLeft: () => <Image source={require("../assets/LOGO.png")} style={styles.headerLogo} />,
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={ProfileScreen} 
        options={{
          tabBarIcon: () => <FontAwesome6 name="user" size={24} color="black" />,
          headerTitle: () => <Text style={styles.headerTitleText}>Profile</Text>,
          headerLeft: () => <Image source={require("../assets/LOGO.png")} style={styles.headerLogo} />,
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
