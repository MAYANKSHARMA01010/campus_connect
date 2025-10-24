import React from 'react'
import { 
  Text, 
  View 
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

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
