import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator, Surface } from "react-native-paper";
import { useAuth } from "../context/UserContext";

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
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Campus Connect</Text>
      </View>

      <Surface style={styles.card}>

        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue your journey</Text>

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

      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    height: 160,
    backgroundColor: "#E91E63",
    justifyContent: "flex-end",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
  },

  headerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  card: {
    marginTop: -60,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    elevation: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
    color: "#E91E63",
  },

  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
    fontSize: 14,
  },

  input: {
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
  },

  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 6,
  },

  link: {
    textAlign: "center",
    color: "#E91E63",
    marginTop: 18,
    fontWeight: "600",
    fontSize: 14,
  },
});
