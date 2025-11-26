import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, Button, Avatar, Divider } from "react-native-paper";
import { useAuth } from "../context/UserContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const joinedDate = user?.joinedDate || "12 Feb 2025";
  const memberSince = user?.memberSince || "08 Jan 2025";

  return (
    <Surface style={styles.container}>
      <View style={styles.card}>
        <Avatar.Text
          size={90}
          label={user?.name?.charAt(0) || "U"}
          style={styles.avatar}
          color="white"
        />

        <Text variant="headlineMedium" style={styles.title}>
          {user?.name}
        </Text>

        <Text variant="bodyMedium" style={styles.username}>
          @{user?.username}
        </Text>

        <Divider style={{ width: "80%", marginVertical: 20 }} />

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{user?.gender || "Not set"}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>Joined Campus Connect</Text>
            <Text style={styles.value}>{joinedDate}</Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>{memberSince}</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("EditProfile")}
          style={styles.editBtn}
          buttonColor="#E91E63"
        >
          Edit Profile
        </Button>

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutBtn}
          textColor="#E91E63"
        >
          Logout
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  card: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 8,
  },
  avatar: {
    backgroundColor: "#E91E63",
    marginBottom: 15,
  },
  title: {
    fontWeight: "600",
    marginBottom: 4,
  },
  username: {
    color: "#666",
    marginBottom: 15,
  },

  /** GRID */
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontSize: 15,
    marginTop: 3,
    fontWeight: "600",
    color: "#222",
  },

  editBtn: {
    width: "80%",
    borderRadius: 10,
  },
  logoutBtn: {
    width: "80%",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
