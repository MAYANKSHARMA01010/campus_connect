import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, Button, Avatar, Divider } from "react-native-paper";

import { useAuth } from "../context/UserContext";
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const colors = useAppTheme();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toDateString()
    : "Not available";

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderRadius: Radius.xl,
          },
        ]}
      >
        <Avatar.Text
          size={scale(90)}
          label={user?.name?.charAt(0) || "U"}
          style={[styles.avatar, { backgroundColor: colors.primary }]}
          color="#fff"
        />

        <Text
          variant="headlineMedium"
          style={[styles.title, { color: colors.textPrimary }]}
        >
          {user?.name}
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.username, { color: colors.textSecondary }]}
        >
          @{user?.username}
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.grid}>
          <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {user?.email}
            </Text>
          </View>

          <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.label, { color: colors.muted }]}>Gender</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {user?.gender || "Not set"}
            </Text>
          </View>

          <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.label, { color: colors.muted }]}>
              Joined CampusConnect
            </Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {joinedDate}
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("EditProfile")}
          buttonColor={colors.primary}
          style={styles.editBtn}
        >
          Edit Profile
        </Button>

        <Button
          mode="outlined"
          onPress={async () => {
            await logout();
          }}
          style={[styles.logoutBtn, { borderColor: colors.primary }]}
          textColor={colors.primary}
        >
          Logout
        </Button>
      </Surface>
    </Surface>
  );
}

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.lg,
  },

  card: {
    alignItems: "center",
    paddingVertical: scale(40),
    paddingHorizontal: Spacing.lg,
    ...Shadows.card,
  },

  avatar: {
    marginBottom: Spacing.md,
  },

  title: {
    fontWeight: Fonts.weight.semiBold,
    marginBottom: Spacing.xs,
  },

  username: {
    marginBottom: Spacing.md,
  },

  divider: {
    width: "80%",
    marginVertical: Spacing.lg,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },

  gridItem: {
    width: "48%",
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  label: {
    fontSize: Fonts.size.sm,
  },

  value: {
    fontSize: Fonts.size.md,
    marginTop: Spacing.xs,
    fontWeight: Fonts.weight.semiBold,
  },

  editBtn: {
    width: "80%",
    borderRadius: Radius.md,
  },

  logoutBtn: {
    width: "80%",
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
