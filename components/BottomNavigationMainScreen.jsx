import React from 'react'
import { 
  Text, 
  View 
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../Screens/Home'
import EventScreen from '../Screens/Events'
import ProfileScreen from '../Screens/Profile'
import SearchScreen from '../Screens/Search'

const Tabs = createBottomTabNavigator()

export default function BottomNavigationMainScreen() {
  return (
    <View>
      <Text>
        BottomNavigationMainScreen
      </Text>
    </View>
  )
}
