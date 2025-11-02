import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigationMainScreen from './components/BottomNavigationMainScreen';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomNavigationMainScreen />
      </NavigationContainer>
    </PaperProvider>
  );
}
