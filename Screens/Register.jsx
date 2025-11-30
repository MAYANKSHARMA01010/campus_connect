import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Surface,
} from "react-native-paper";

import { useAuth } from "../context/UserContext";
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function RegisterScreen({ navigation }) {
  const colors = useAppTheme();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (Object.values(form).some((v) => !v))
      return Alert.alert("Missing Fields", "Please fill all fields");

    if (form.password !== form.confirm_password)
      return Alert.alert("Password Error", "Passwords do not match");

    setLoading(true);
    const success = await register(form);
    setLoading(false);

    if (success) navigation.navigate("Login");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerText}>Campus Connect</Text>
      </View>

      {/* CARD */}
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderRadius: Radius.xl,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          Create Account ✨
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join your campus community
        </Text>

        <TextInput
          label="Full Name"
          mode="outlined"
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
          style={styles.input}
        />

        <TextInput
          label="Username"
          mode="outlined"
          value={form.username}
          onChangeText={(v) => handleChange("username", v)}
          style={styles.input}
        />

        <TextInput
          label="Email"
          mode="outlined"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />

        <TextInput
          label="Confirm Password"
          mode="outlined"
          value={form.confirm_password}
          onChangeText={(v) => handleChange("confirm_password", v)}
          secureTextEntry={!showConfirm}
          right={
            <TextInput.Icon
              icon={showConfirm ? "eye-off" : "eye"}
              onPress={() => setShowConfirm(!showConfirm)}
            />
          }
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          buttonColor={colors.primary}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.surface} /> : "Register"}
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
}

// --------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    height: scale(160),
    justifyContent: "flex-end",
    padding: Spacing.xl,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    ...Shadows.card,
  },

  headerText: {
    color: "#fff",
    fontSize: Fonts.size.title,
    fontWeight: Fonts.weight.bold,
  },

  card: {
    marginTop: scale(-60),
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    ...Shadows.card,
  },

  title: {
    textAlign: "center",
    fontSize: Fonts.size.xxl,
    fontWeight: Fonts.weight.bold,
    marginBottom: Spacing.xs,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    fontSize: Fonts.size.md,
  },

  input: {
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
  },

  button: {
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
  },

  link: {
    textAlign: "center",
    marginTop: Spacing.lg,
    fontWeight: Fonts.weight.semiBold,
    fontSize: Fonts.size.md,
  },
});
