import { 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';
import BottomNavigationMainScreen from './components/BottomNavigationMainScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <BottomNavigationMainScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
