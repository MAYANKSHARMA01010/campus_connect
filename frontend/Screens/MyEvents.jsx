import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Alert, Image } from "react-native";
import {
  Text,
  Button,
  Chip,
  ActivityIndicator,
  Card,
} from "react-native-paper";
import { useMyEvents } from "../hooks/useMyEvents";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Radius } from "../theme/theme";
import EventStatusChip from "../components/EventStatusChip";

export default function MyEvents() {
  const colors = useAppTheme();

  const { events, loading, deleteEvent, setFilter, filter } = useMyEvents();
  const filteredEvents = events;
  const handleDelete = (id) => {
    deleteEvent(id);
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

          <View style={styles.statusRow}>
            <EventStatusChip status={item.status} />
          </View>

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
            selected={filter === s}
            onPress={() => setFilter(s)}
            style={[styles.filterChip, filter === s && styles.selectedChip]}
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
  },

  image: {
    height: 180,
    width: "100%",
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
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
});
