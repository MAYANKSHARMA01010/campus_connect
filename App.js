import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigationMainScreen from './components/BottomNavigationMainScreen';

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.mainContainer}>
        <BottomNavigationMainScreen />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
