import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

export default function SearchScreen() {
  return (
    <View style={styles.mainContainer}>
        <Text>
            Search Screen
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
