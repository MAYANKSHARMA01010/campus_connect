import React, { useEffect, useState, useCallback, Suspense } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  Chip,
  Menu,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import API from "../api/api";
import EventCard from "../components/EventCard";

import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Fonts, Radius } from "../theme/theme";
import { scale } from "../theme/layout";

const LIMIT = 8;

export default function EventScreen({ navigation }) {
  const colors = useAppTheme();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [sortType, setSortType] = useState("recent");
  const [sortVisible, setSortVisible] = useState(false);

  const [showPast, setShowPast] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEvents = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setPage(1);
        }

        const res = await API.get("/events", {
          params: {
            page: reset ? 1 : page,
            limit: LIMIT,
            category: activeCategory,
            sort: sortType,
            past: showPast,
          },
        });

        const eventData = res?.data?.events || [];
        const categoryData = res?.data?.categories || [];

        if (reset) {
          setEvents(eventData);
          setPage(2);
        } else {
          setEvents((prev) => [...prev, ...eventData]);
          setPage((p) => p + 1);
        }

        setCategories(["all", ...categoryData]);
        setTotalEvents(res?.data?.total || 0);
      } catch (e) {
        console.log("Fetch Error:", e.response?.data || e.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [page, activeCategory, sortType, showPast]
  );

  useEffect(() => {
    fetchEvents(true);
  }, [activeCategory, sortType, showPast]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents(true);
  };

  const loadMore = () => {
    if (loadingMore || events.length >= totalEvents) return;
    setLoadingMore(true);
    fetchEvents(false);
  };

  const onSortSelect = (type) => {
    setSortType(type);
    setSortVisible(false);
  };

  const renderItem = useCallback(
    ({ item }) => <EventCard item={item} navigation={navigation} />,
    [navigation]
  );

  const ShimmerCard = () => (
    <View style={[styles.shimmerCard, { backgroundColor: colors.border }]} />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" translucent />

      {/* HEADER */}
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Campus Events</Text>

            <Text style={styles.headerSubtitle}>Discover what's happening</Text>
          </View>

          <Menu
            visible={sortVisible}
            onDismiss={() => setSortVisible(false)}
            anchor={
              <IconButton
                icon="sort-variant"
                size={scale(24)}
                iconColor="#fff"
                onPress={() => setSortVisible(true)}
              />
            }
          >
            <Menu.Item
              title="Recent First"
              onPress={() => onSortSelect("recent")}
            />
            <Menu.Item
              title="By Location"
              onPress={() => onSortSelect("location")}
            />
            <Menu.Item
              title="By Duration"
              onPress={() => onSortSelect("duration")}
            />
          </Menu>
        </View>
      </LinearGradient>

      {/* CATEGORY SELECTOR */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <Chip
            selected={activeCategory === item}
            onPress={() => setActiveCategory(item)}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  activeCategory === item ? colors.surface : colors.background,
              },
            ]}
            textStyle={[styles.chipText, { color: colors.textPrimary }]}
          >
            {item.toUpperCase()}
          </Chip>
        )}
      />

      {/* PAST EVENTS TOGGLE */}
      <View style={styles.pastToggleRow}>
        <Text style={styles.pastLabel}>Show past events</Text>

        <Chip
          selected={showPast}
          onPress={() => setShowPast((prev) => !prev)}
          style={[
            styles.pastChip,
            {
              backgroundColor: showPast ? colors.surface : colors.background,
            },
          ]}
          textStyle={styles.chipText}
        >
          {showPast ? "ON" : "OFF"}
        </Chip>
      </View>

      {/* LIST */}
      <Suspense fallback={<ShimmerCard />}>
        {loading ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.45}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              paddingBottom: scale(70),
            }}
            ListFooterComponent={
              loadingMore && (
                <ActivityIndicator style={{ marginVertical: Spacing.md }} />
              )
            }
          />
        )}
      </Suspense>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + Spacing.lg
        : Spacing.xl,

    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: Fonts.size.xxl,
    fontWeight: Fonts.weight.bold,
  },

  headerSubtitle: {
    color: "#eef",
    marginTop: Spacing.xs,
    fontSize: Fonts.size.md,
  },

  categoryList: {
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.md,
  },

  categoryChip: {
    marginRight: Spacing.sm,
    height: scale(38),
    justifyContent: "center",
  },

  chipText: {
    fontWeight: Fonts.weight.semiBold,
  },

  pastToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },

  pastLabel: {
    fontWeight: Fonts.weight.semiBold,
  },

  pastChip: {},

  shimmerCard: {
    height: scale(200),
    borderRadius: Radius.md,
    margin: Spacing.md,
  },
});
