import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';

export default function SearchScreen() {
  return (
    <Surface style={styles.mainContainer}>
      <Text variant="headlineMedium">Search Screen</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
