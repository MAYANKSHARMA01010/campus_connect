import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ManageEventsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                ✅ Admin Manage Events Screen
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
});
