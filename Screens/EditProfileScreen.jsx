import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    gender: user?.gender || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => setForm({ ...form, [key]: val });

  const handleSave = async () => {
    setLoading(true);
    await updateProfile(form);
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Profile ✏️</Text>
      <TextInput label="Full Name" mode="outlined" value={form.name} onChangeText={(v) => handleChange("name", v)} style={styles.input} />
      <TextInput label="Username" mode="outlined" value={form.username} onChangeText={(v) => handleChange("username", v)} style={styles.input} />
      <TextInput label="Gender" mode="outlined" value={form.gender} onChangeText={(v) => handleChange("gender", v)} style={styles.input} />

      <Button mode="contained" onPress={handleSave} style={styles.button} buttonColor="#E91E63" disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : "Save Changes"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { textAlign: "center", marginBottom: 30, fontWeight: "700", color: "#E91E63" },
  input: { marginBottom: 16 },
  button: { marginTop: 10, borderRadius: 10, paddingVertical: 6 },
});