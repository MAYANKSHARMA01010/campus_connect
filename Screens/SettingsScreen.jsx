import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";

import {
    Appbar,
    List,
    Switch,
    Divider,
    RadioButton,
    Button,
} from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import API from "../api/api";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius } from "../theme/theme";

export default function SettingsScreen({ user }) {
    const navigation = useNavigation();
    const colors = useAppTheme();

    const isHost = user?.role !== "USER";

    // 🔧 Visual selector only — system already controls theme via OS
    const [theme, setTheme] = useState("system");

    const [notifications, setNotifications] = useState({
        reminders: true,
        nearby: true,
        updates: true,
        messages: true,
    });

    const toggleNotification = (key) =>
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
            navigation.replace("Auth");
        } catch (err) {
            Alert.alert("Error", "Logout failed");
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "This will permanently remove your account and all your data.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.delete("/users/me");
                            navigation.replace("Auth");
                        } catch (err) {
                            Alert.alert("Error", "Account deletion failed");
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Appbar.Header>
                <Appbar.Content title="Settings" />
            </Appbar.Header>

            {/* ---------------- ACCOUNT ---------------- */}
            <List.Section>
                <List.Subheader>Account</List.Subheader>

                <List.Item
                    title="Profile"
                    left={(props) => <List.Icon {...props} icon="account" />}
                    onPress={() => navigation.navigate("Profile")}
                />

                <List.Item
                    title="Change Password"
                    left={(props) => <List.Icon {...props} icon="lock-reset" />}
                    onPress={() => navigation.navigate("ChangePassword")}
                />

                {isHost && (
                    <List.Item
                        title="My Hosted Events"
                        left={(props) => <List.Icon {...props} icon="calendar" />}
                        onPress={() => navigation.navigate("ManageEvents")}
                    />
                )}
            </List.Section>

            <Divider />

            {/* ---------------- NOTIFICATIONS ---------------- */}
            <List.Section>
                <List.Subheader>Notifications</List.Subheader>

                <List.Item
                    title="Event Reminders"
                    right={() => (
                        <Switch
                            value={notifications.reminders}
                            onValueChange={() => toggleNotification("reminders")}
                        />
                    )}
                />

                <List.Item
                    title="New Events Nearby"
                    right={() => (
                        <Switch
                            value={notifications.nearby}
                            onValueChange={() => toggleNotification("nearby")}
                        />
                    )}
                />

                <List.Item
                    title="Status Updates"
                    right={() => (
                        <Switch
                            value={notifications.updates}
                            onValueChange={() => toggleNotification("updates")}
                        />
                    )}
                />

                <List.Item
                    title="Host Messages"
                    right={() => (
                        <Switch
                            value={notifications.messages}
                            onValueChange={() => toggleNotification("messages")}
                        />
                    )}
                />
            </List.Section>

            <Divider />

            {/* ---------------- THEME ---------------- */}
            <List.Section>
                <List.Subheader>Appearance</List.Subheader>

                <RadioButton.Group onValueChange={setTheme} value={theme}>
                    <List.Item
                        title="Light"
                        right={() => <RadioButton value="light" />}
                    />

                    <List.Item title="Dark" right={() => <RadioButton value="dark" />} />

                    <List.Item
                        title="System"
                        right={() => <RadioButton value="system" />}
                    />
                </RadioButton.Group>
            </List.Section>

            <Divider />

            {/* ---------------- ACTIONS ---------------- */}
            <List.Section>
                <List.Subheader>Account Actions</List.Subheader>

                <Button
                    mode="outlined"
                    style={styles.btn}
                    onPress={handleLogout}
                    textColor={colors.primary}
                >
                    Logout
                </Button>

                <Button
                    mode="contained"
                    style={[styles.btn, styles.delete]}
                    buttonColor={colors.danger}
                    onPress={handleDeleteAccount}
                >
                    Delete Account
                </Button>
            </List.Section>
        </ScrollView>
    );
}

// ---------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    btn: {
        marginHorizontal: Spacing.lg,
        marginVertical: Spacing.sm,
        borderRadius: Radius.md,
    },

    delete: {
        marginTop: Spacing.md,
    },
});
