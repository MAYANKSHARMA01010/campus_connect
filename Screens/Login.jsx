import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login, isLoggedIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigation.navigate("Home");
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!identifier || !password)
      return alert("Please enter email/username and password");

    setLoading(true);
    const success = await login(
      identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password }
    );
    setLoading(false);

    if (success) navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back 👋
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
        buttonColor="#E91E63"
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : "Login"}
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { textAlign: "center", marginBottom: 30, fontWeight: "700", color: "#E91E63" },
  input: { marginBottom: 16 },
  button: { marginTop: 10, borderRadius: 10, paddingVertical: 6 },
  link: { textAlign: "center", color: "#E91E63", marginTop: 20, fontWeight: "600" },
});
