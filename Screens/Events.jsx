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

import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Fonts, Radius } from "../theme/theme";
import { scale } from "../theme/layout";

const LIMIT = 8;

export default function EventScreen({ navigation }) {
  const colors = useAppTheme();

  const [activeCategory, setActiveCategory] = useState("all");
  const [sortType, setSortType] = useState("recent");
  const [sortVisible, setSortVisible] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [page, setPage] = useState(1);

  const {
    events,
    categories,
    totalEvents,
    loading,
    refreshing,
    loadingMore,
    fetchEvents,
    setRefreshing,
    setLoadingMore,
  } = useEvents(LIMIT);

  useEffect(() => {
    fetchEvents({
      page: 1,
      category: activeCategory,
      sort: sortType,
      past: showPast,
      reset: true,
    });
    setPage(2);
  }, [activeCategory, sortType, showPast, fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents({
      page: 1,
      category: activeCategory,
      sort: sortType,
      past: showPast,
      reset: true,
    });
    setPage(2);
  };

  const loadMore = () => {
    if (loadingMore || events.length >= totalEvents) return;
    setLoadingMore(true);
    fetchEvents({
      page: page,
      category: activeCategory,
      sort: sortType,
      past: showPast,
    });
    setPage((p) => p + 1);
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

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <View style={styles.chipWrapper}>
            <Chip
              selected={activeCategory === item}
              onPress={() => setActiveCategory(item)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    activeCategory === item
                      ? colors.surface
                      : colors.background,
                },
              ]}
              textStyle={[styles.chipText, { color: colors.textPrimary }]}
            >
              {item.toUpperCase()}
            </Chip>
          </View>
        )}
      />

      <View style={styles.pastToggleRow}>
        <Text style={styles.pastLabel}>Show past events</Text>
        <View style={styles.chipWrapper}>
          <Chip
            selected={showPast}
            onPress={() => setShowPast(!showPast)}
            style={[
              styles.pastChip,
              {
                backgroundColor: showPast ? colors.surface : colors.background,
              },
            ]}
          >
            {showPast ? "ON" : "OFF"}
          </Chip>
        </View>
      </View>

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
            keyExtractor={(item) => String(item.id)}
            onEndReached={loadMore}
            onEndReachedThreshold={0.45}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: scale(70) }}
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
  container: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight + Spacing.lg) / 4
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
    fontSize: Fonts.size.md,
  },

  categoryList: {
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.md,
  },

  chipWrapper: {
    borderRadius: Radius.md,
    overflow: "hidden",
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
