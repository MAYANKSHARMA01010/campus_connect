import { 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';
import BottomNavigationMainScreen from './components/BottomNavigationMainScreen';

export default function App() {
  return (
    <View style={styles.mainContainer}>
      <BottomNavigationMainScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
