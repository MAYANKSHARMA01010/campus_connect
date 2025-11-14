import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, Button } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <Surface style={styles.mainContainer}>
      <Text variant="headlineMedium">👤 Profile</Text>
      {user ? (
        <>
          <Text style={styles.detail}>Name: {user.name}</Text>
          <Text style={styles.detail}>Username: {user.username}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>
          {user.gender && <Text style={styles.detail}>Gender: {user.gender}</Text>}

          <Button
            mode="contained"
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.button}
            buttonColor="#E91E63"
          >
            Edit Profile
          </Button>

          <Button
            mode="outlined"
            onPress={logout}
            style={styles.logoutButton}
            textColor="#E91E63"
          >
            Logout
          </Button>
        </>
      ) : (
        <Text>No user info available</Text>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  detail: { marginTop: 10, fontSize: 16 },
  button: { marginTop: 30, width: 200, borderRadius: 8 },
  logoutButton: { marginTop: 10, width: 200, borderRadius: 8, borderWidth: 1 },
});
