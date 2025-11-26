import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Surface,
  Menu,
} from "react-native-paper";
import { useAuth } from "../context/UserContext";

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    gender: user?.gender || "",
  });

  const [loading, setLoading] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(form);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Surface style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          Edit Profile ✏️
        </Text>

        <TextInput
          label="Full Name"
          mode="outlined"
          style={styles.input}
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
        />

        <TextInput
          label="Username"
          mode="outlined"
          style={styles.input}
          value={form.username}
          onChangeText={(v) => handleChange("username", v)}
        />

        <Menu
          visible={genderMenuVisible}
          onDismiss={() => setGenderMenuVisible(false)}
          anchor={
            <TextInput
              label="Gender"
              mode="outlined"
              value={form.gender}
              editable={false}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="chevron-down"
                  onPress={() => setGenderMenuVisible(true)}
                />
              }
            />
          }
        >
          <Menu.Item
            onPress={() => {
              handleChange("gender", "Male");
              setGenderMenuVisible(false);
            }}
            title="Male"
          />
          <Menu.Item
            onPress={() => {
              handleChange("gender", "Female");
              setGenderMenuVisible(false);
            }}
            title="Female"
          />
          <Menu.Item
            onPress={() => {
              handleChange("gender", "Prefer not to say");
              setGenderMenuVisible(false);
            }}
            title="Prefer not to say"
          />
        </Menu>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          buttonColor="#E91E63"
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : "Save Changes"}
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 8,
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "700",
    color: "#E91E63",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  button: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 6,
  },
});
