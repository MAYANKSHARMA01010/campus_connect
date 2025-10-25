import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.bigC}>C</Text>

        <View style={styles.rightTextContainer}>
          <Text style={styles.ampus}>AMPUS</Text>
          <Text style={styles.onnect}>ONNECT</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginLeft: 38,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bigC: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  rightTextContainer: {
    flexDirection: 'column',
    marginTop: 16,
    marginLeft: 3,
  },
  ampus: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  onnect: {
    fontSize: 20,
    marginTop: -5,
    fontWeight: 'bold',
  },
});
