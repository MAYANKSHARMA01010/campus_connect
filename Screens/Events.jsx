import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

export default function EventScreen() {
  return (
    <View style={styles.mainContainer}>
        <Text>
            Events Screen
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
})
