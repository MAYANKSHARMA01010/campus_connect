import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
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
      return alert("Please fill in all fields");
    setLoading(true);
    await register(form);
    setLoading(false);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Account ✨
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
        buttonColor="#E91E63"
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : "Register"}
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: "#fff" },
  title: { textAlign: "center", marginBottom: 30, fontWeight: "700", color: "#E91E63" },
  input: { marginBottom: 16 },
  button: { marginTop: 10, borderRadius: 10, paddingVertical: 6 },
  link: { textAlign: "center", color: "#E91E63", marginTop: 20, fontWeight: "600" },
});
