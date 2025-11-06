import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigationMainScreen from './components/BottomNavigationMainScreen';
import { AuthProvider } from './context/AuthContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <BottomNavigationMainScreen />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
