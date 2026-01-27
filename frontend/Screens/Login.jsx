import React, { useState, useEffect } from "react";
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

export default function LoginScreen({ navigation }) {
  const { login, isLoggedIn } = useAuth();
  const colors = useAppTheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigation.navigate("Home");
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!identifier || !password)
      return Alert.alert(
        "Missing Fields",
        "Please enter email/username and password"
      );

    setLoading(true);

    await login(
      identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password }
    );

    setLoading(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerText}>Campus Connect</Text>
      </View>

      
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
          Welcome Back 👋
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Login to continue your journey
        </Text>

        <TextInput
          label="Email or Username"
          mode="outlined"
          value={identifier}
          onChangeText={setIdentifier}
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          buttonColor={colors.primary}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.surface} /> : "Login"}
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
}

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
