import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { Appbar, Text } from 'react-native-paper';

import HomeScreen from '../Screens/Home';
import EventScreen from '../Screens/Events';
import ProfileScreen from '../Screens/Profile';
import SearchScreen from '../Screens/Search';

const Tabs = createBottomTabNavigator();

function CustomHeader({ title }) {
  return (
    <Appbar.Header style={styles.header}>
      <Image source={require('../assets/LOGO.png')} style={styles.headerLogo} />
      <Appbar.Content title={<Text variant="titleLarge">{title}</Text>} titleStyle={styles.headerTitleText} />
    </Appbar.Header>
  );
}

export default function BottomNavigationMainScreen() {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: ({ route }) => <CustomHeader title={route.name} />,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => <Ionicons name="search" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarIcon: () => <MaterialIcons name="event" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <FontAwesome6 name="user" size={24} color="black" />,
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e6e6e6',
    elevation: 2,
  },
  headerLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  headerTitleText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
