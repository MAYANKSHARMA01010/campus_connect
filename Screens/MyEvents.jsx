import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Alert, Image } from "react-native";
import {
    Text,
    Button,
    Chip,
    ActivityIndicator,
    Card,
} from "react-native-paper";
import { getMyEvents, deleteMyEvent } from "../api/events";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Radius } from "../theme/theme";

export default function MyEvents() {
    const colors = useAppTheme();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const data = await getMyEvents();
            setEvents(data);
        } catch {
            Alert.alert("Error", "Failed to load your events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        if (statusFilter === "ALL") return events;
        return events.filter((e) => e.status === statusFilter);
    }, [events, statusFilter]);

    const handleDelete = (id) => {
        const safeId = Number(id);
        if (!safeId || Number.isNaN(safeId)) {
            Alert.alert("Invalid event id");
            return;
        }

        Alert.alert("Delete Event", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteMyEvent(safeId);
                        fetchMyEvents();
                    } catch {
                        Alert.alert("Error", "Failed to delete event");
                    }
                },
            },
        ]);
    };

    const renderStatus = (status) => {
        switch (status) {
            case "APPROVED":
                return (
                    <Chip textStyle={{ color: "green" }} style={styles.approved}>
                        APPROVED
                    </Chip>
                );
            case "REJECTED":
                return (
                    <Chip textStyle={{ color: "red" }} style={styles.rejected}>
                        REJECTED
                    </Chip>
                );
            default:
                return (
                    <Chip textStyle={{ color: "orange" }} style={styles.pending}>
                        PENDING
                    </Chip>
                );
        }
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
    }

    if (!events.length) {
        return (
            <View style={styles.empty}>
                <Text variant="titleMedium">You have not added any events yet.</Text>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                    Your submitted event requests will appear here.
                </Text>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const image = item?.images?.length ? { uri: item.images[0].url } : null;

        return (
            <Card style={styles.card}>
                {image && (
                    <Image source={image} style={styles.image} resizeMode="cover" />
                )}

                <Card.Title title={item.title} />

                <Card.Content>
                    <Text>{item.location}</Text>
                    <Text>
                        {item.date ? new Date(item.date).toDateString() : "No date"}
                    </Text>

                    <View style={styles.statusRow}>{renderStatus(item.status)}</View>

                    <Button
                        mode="outlined"
                        style={styles.deleteBtn}
                        textColor={colors.danger}
                        onPress={() => handleDelete(item.id)}
                    >
                        Delete Request
                    </Button>
                </Card.Content>
            </Card>
        );
    };

    return (
        <>
            <View style={styles.filterRow}>
                {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                    <Chip
                        key={s}
                        selected={statusFilter === s}
                        onPress={() => setStatusFilter(s)}
                        style={[
                            styles.filterChip,
                            statusFilter === s && styles.selectedChip,
                        ]}
                    >
                        {s}
                    </Chip>
                ))}
            </View>

            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.container}
                renderItem={renderItem}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.md,
    },

    card: {
        marginBottom: Spacing.md,
        borderRadius: Radius.md,
        overflow: "hidden",
    },

    image: {
        height: 180,
        width: "100%",
    },

    deleteBtn: {
        marginTop: Spacing.sm,
    },

    statusRow: {
        flexDirection: "row",
        marginVertical: Spacing.sm,
    },

    filterRow: {
        flexDirection: "row",
        gap: 8,
        padding: Spacing.sm,
    },

    filterChip: {
        backgroundColor: "#eee",
    },

    selectedChip: {
        backgroundColor: "#cce5ff",
    },

    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.xl,
    },

    approved: {
        backgroundColor: "rgba(0, 200, 0, 0.15)",
    },

    pending: {
        backgroundColor: "rgba(255, 165, 0, 0.15)",
    },

    rejected: {
        backgroundColor: "rgba(255, 0, 0, 0.15)",
    },
});
