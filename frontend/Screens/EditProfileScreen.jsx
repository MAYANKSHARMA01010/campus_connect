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
import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";

export default function EditProfileScreen({ navigation }) {
  const colors = useAppTheme();
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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderRadius: Radius.xl,
          },
        ]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: colors.primary }]}
        >
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
          disabled={loading}
          buttonColor={colors.primary}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
  },

  card: {
    width: "100%",
    padding: Spacing.xl,
    ...Shadows.card,
  },

  title: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    fontWeight: Fonts.weight.bold,
  },

  input: {
    marginBottom: Spacing.md,
  },

  button: {
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
  },
});
