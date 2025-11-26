import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator, Surface } from "react-native-paper";
import { useAuth } from "../context/UserContext";

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

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (Object.values(form).some((v) => !v))
      return alert("Please fill all fields");

    if (form.password !== form.confirm_password)
      return alert("Passwords do not match");

    setLoading(true);
    const success = await register(form);
    setLoading(false);

    if (success) navigation.navigate("Login");
  };

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Campus Connect</Text>
      </View>

      <Surface style={styles.card}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Join your campus community</Text>

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
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  header: {
    height: 160,
    backgroundColor: "#E91E63",
    justifyContent: "flex-end",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: { color: "#FFF", fontSize: 28, fontWeight: "800" },
  card: {
    marginTop: -60,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
  },
  title: { textAlign: "center", fontSize: 24, fontWeight: "700", color: "#E91E63" },
  subtitle: { textAlign: "center", color: "#555", marginBottom: 25 },
  input: { marginBottom: 16, backgroundColor: "#FAFAFA" },
  button: { marginTop: 10, borderRadius: 10, paddingVertical: 6 },
  link: { textAlign: "center", color: "#E91E63", marginTop: 18, fontWeight: "600" },
});
