import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  Surface,
  Text,
  Searchbar,
  ActivityIndicator,
  Chip,
  Divider,
} from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";

import { eventAPI } from "../api/api";
import EventCard from "../components/EventCard";

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function SearchScreen() {
  const colors = useAppTheme();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const activeRequest = useRef(0);

  const fetchResults = useCallback(async (searchText = "") => {
    const currentReq = ++activeRequest.current;

    if (!searchText.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await eventAPI.search(searchText.trim());

      if (activeRequest.current !== currentReq) return;

      const safeResults = (data?.results || []).filter(
        (item) => item && typeof item === "object" && item.id
      );

      setResults(safeResults);
    } catch {
      setError("Failed to search");
    } finally {
      if (activeRequest.current === currentReq) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [query, fetchResults]);

  const onRefresh = useCallback(async () => {
    if (!query.trim()) return;
    setRefreshing(true);
    await fetchResults(query);
    setRefreshing(false);
  }, [query, fetchResults]);

  const renderItem = useCallback(
    ({ item }) => (item ? <EventCard item={item} /> : null),
    []
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Surface
          style={[styles.container, { backgroundColor: colors.surface }]}
        >
          <View style={styles.header}>
            <Searchbar
              placeholder="Search by event, host or location…"
              value={query}
              onChangeText={setQuery}
              style={[styles.search, { backgroundColor: colors.surface }]}
              elevation={2}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <View style={styles.chipRow}>
              {["Concert", "Sports", "Tech", "Workshop"].map((cat) => (
                <Chip key={cat} compact style={styles.chip}>
                  {cat}
                </Chip>
              ))}
            </View>
          </View>

          <Divider />

          <View style={styles.content}>
            {loading && (
              <View style={styles.center}>
                <ActivityIndicator size="large" />
              </View>
            )}

            {!loading && error && (
              <View style={styles.center}>
                <Text
                  variant="bodyLarge"
                  style={[styles.error, { color: colors.danger }]}
                >
                  {error}
                </Text>
              </View>
            )}

            {!loading && !error && results.length === 0 && (
              <View style={styles.center}>
                <Text
                  variant="bodyLarge"
                  style={[styles.empty, { color: colors.textSecondary }]}
                >
                  {query ? "No results found" : "Start typing to search"}
                </Text>
              </View>
            )}

            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.id)}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={8}
              removeClippedSubviews
              keyboardDismissMode="on-drag"
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </Surface>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    paddingBottom: Spacing.xs,
  },

  search: {
    margin: Spacing.md,
    borderRadius: Radius.md,
    ...Shadows.card,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  chip: {
    borderRadius: Radius.sm,
  },

  content: {
    flex: 1,
  },

  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: scale(30),
  },

  center: {
    paddingTop: scale(60),
    alignItems: "center",
  },

  empty: {
    opacity: 0.7,
  },

  error: {
    fontWeight: Fonts.weight.medium,
  },
});
