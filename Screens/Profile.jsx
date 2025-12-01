import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Appbar,
  Text,
  Button,
  Avatar,
  Divider,
} from "react-native-paper";

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
    <>
      {/* ✅ HEADER WITH BACK */}
      <Appbar.Header
        style={{ backgroundColor: colors.surface }}
        elevated
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ HERO PROFILE */}
        <View style={styles.hero}>
          <Avatar.Text
            size={scale(110)}
            label={user?.name?.charAt(0) || "U"}
            style={[styles.avatar, { backgroundColor: colors.primary }]}
            color="#fff"
          />

          <Text
            variant="headlineSmall"
            style={[styles.title, { color: colors.textPrimary }]}
          >
            {user?.name}
          </Text>

          <Text
            style={[styles.username, { color: colors.textSecondary }]}
          >
            @{user?.username}
          </Text>
        </View>

        <Divider style={{ marginVertical: Spacing.lg }} />

        {/* ✅ INFO GRID */}
        <View style={styles.grid}>
          <InfoItem label="Email" value={user?.email} colors={colors} />
          <InfoItem label="Gender" value={user?.gender || "Not set"} colors={colors} />
          <InfoItem label="Joined" value={joinedDate} colors={colors} />
        </View>

        {/* ✅ ACTIONS */}
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
          onPress={logout}
          style={[styles.logoutBtn, { borderColor: colors.primary }]}
          textColor={colors.primary}
        >
          Logout
        </Button>
      </ScrollView>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function InfoItem({ label, value, colors }) {
  return (
    <View
      style={[
        styles.gridItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.muted }]}>
        {label}
      </Text>

      <Text
        style={[styles.value, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: scale(40),
  },

  hero: {
    alignItems: "center",
    marginTop: scale(10),
  },

  avatar: {
    marginBottom: Spacing.md,
  },

  title: {
    fontWeight: Fonts.weight.semiBold,
  },

  username: {
    marginTop: Spacing.xs,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: Spacing.md,
  },

  gridItem: {
    width: "48%",
    borderRadius: Radius.md,
    padding: Spacing.md,

    borderWidth: 1,

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
    marginTop: Spacing.xl,
    borderRadius: Radius.md,
  },

  logoutBtn: {
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
