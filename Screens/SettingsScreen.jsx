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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/UserContext";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Radius } from "../theme/theme";
import { scale } from "../theme/layout";

export default function SettingsScreen() {
    const navigation = useNavigation();
    const colors = useAppTheme();
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();

    const role = user?.role;

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

    const showComingSoon = (feature) => {
        Alert.alert(
            "Coming Soon 🚀",
            `${feature} functionality will be added in a future update.`,
            [{ text: "OK" }]
        );
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            Alert.alert("Error", "Logout failed");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[
                styles.content,
                { paddingBottom: scale(140) + insets.bottom },
            ]}
            style={{ backgroundColor: colors.background }}
        >
            <Appbar.Header style={{ backgroundColor: colors.surface }}>
                <Appbar.Content title="Settings" />
            </Appbar.Header>

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
                    onPress={() => showComingSoon("Change Password")}
                />

                {role === "USER" && (
                    <List.Item
                        title="My Added Events"
                        left={(props) => <List.Icon {...props} icon="calendar" />}
                        onPress={() => navigation.navigate("MyEvents")}
                    />
                )}

                {role === "ADMIN" && (
                    <List.Item
                        title="Manage Events"
                        left={(props) => <List.Icon {...props} icon="calendar-edit" />}
                        onPress={() => navigation.navigate("ManageEvents")}
                    />
                )}
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Notifications</List.Subheader>

                {[
                    ["Event Reminders", "reminders"],
                    ["New Events Nearby", "nearby"],
                    ["Status Updates", "updates"],
                    ["Host Messages", "messages"],
                ].map(([title, key]) => (
                    <List.Item
                        key={key}
                        title={title}
                        right={() => (
                            <Switch
                                value={notifications[key]}
                                onValueChange={() => toggleNotification(key)}
                            />
                        )}
                    />
                ))}
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Appearance</List.Subheader>

                <RadioButton.Group onValueChange={setTheme} value={theme}>
                    <List.Item title="Light" right={() => <RadioButton value="light" />} />
                    <List.Item title="Dark" right={() => <RadioButton value="dark" />} />
                    <List.Item title="System" right={() => <RadioButton value="system" />} />
                </RadioButton.Group>
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Account Actions</List.Subheader>

                <Button
                    mode="outlined"
                    style={styles.btn}
                    textColor={colors.primary}
                    onPress={handleLogout}
                >
                    Logout
                </Button>

                <Button
                    mode="contained"
                    style={[styles.btn, styles.delete]}
                    buttonColor={colors.danger}
                    onPress={() => showComingSoon("Delete Account")}
                >
                    Delete Account
                </Button>
            </List.Section>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
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
