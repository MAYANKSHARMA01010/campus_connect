import React, { useEffect, useState, useCallback, Suspense, useRef } from "react";
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
  Menu,
  IconButton,
  Button,
  Surface,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import { ListSkeleton } from "../components/SkeletonLoaders";
import { useThemeMode } from "../context/ThemeContext";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing, Fonts, Radius } from "../theme/theme";
import { scale } from "../theme/layout";

const LIMIT = 8;

export default function EventScreen({ navigation }) {
  const colors = useAppTheme();
  const { isDark } = useThemeMode();

  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [sortType, setSortType] = useState("recent");
  const [sortVisible, setSortVisible] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [page, setPage] = useState(1);
  const loadMoreLockRef = useRef(false);

  const {
    events,
    categories,
    totalEvents,
    hasMore,
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

  const loadMore = async () => {
    if (loadMoreLockRef.current) return;
    if (loading || loadingMore || !hasMore || events.length >= totalEvents) return;

    loadMoreLockRef.current = true;
    setLoadingMore(true);

    try {
      await fetchEvents({
        page: page,
        category: activeCategory,
        sort: sortType,
        past: showPast,
      });
      setPage((p) => p + 1);
    } finally {
      loadMoreLockRef.current = false;
    }
  };

  const onSortSelect = (type) => {
    setSortType(type);
    setSortVisible(false);
  };

  const renderItem = useCallback(
    ({ item }) => <EventCard item={item} navigation={navigation} />,
    [navigation]
  );

  const resetFilters = useCallback(() => {
    setActiveCategory("all");
    setSortType("recent");
    setShowPast(false);
  }, []);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyWrap}>
        <Surface
          style={[
            styles.emptyCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          elevation={0}
        >
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No events found</Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}> 
            Try changing category or turn off past-event filter.
          </Text>
          <Button mode="contained" onPress={resetFilters} buttonColor={colors.primary}>
            Reset Filters
          </Button>
        </Surface>
      </View>
    ),
    [colors, resetFilters]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent />

      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Campus Events</Text>
            <Text style={styles.headerSubtitle}>Discover what's happening</Text>
          </View>

          <View style={styles.headerControls}>
            <Menu
              visible={categoryVisible}
              onDismiss={() => setCategoryVisible(false)}
              anchor={
                <IconButton
                  icon="shape-outline"
                  size={scale(22)}
                  iconColor="#fff"
                  onPress={() => setCategoryVisible(true)}
                />
              }
            >
              {categories.map((cat) => (
                <Menu.Item
                  key={cat}
                  title={cat === "all" ? "All Categories" : cat.toUpperCase()}
                  onPress={() => {
                    setActiveCategory(cat);
                    setCategoryVisible(false);
                  }}
                />
              ))}
            </Menu>

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
        </View>

        <Text style={[styles.categoryHint, { color: "#E6F1FF" }]}> 
          Category: {activeCategory === "all" ? "All" : activeCategory.toUpperCase()}
        </Text>
      </LinearGradient>

      <View style={styles.pastToggleRow}>
        <Text style={[styles.pastLabel, { color: colors.textSecondary }]}>Show past events</Text>
        <IconButton
          icon={showPast ? "toggle-switch" : "toggle-switch-off-outline"}
          size={scale(34)}
          iconColor={showPast ? colors.primary : colors.muted}
          onPress={() => setShowPast(!showPast)}
        />
      </View>

      <Suspense fallback={<ListSkeleton count={3} />}>
        {loading ? (
          <ListSkeleton count={3} />
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            onEndReached={loadMore}
            onEndReachedThreshold={0.45}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            contentContainerStyle={[
              styles.listContent,
              events.length === 0 && styles.listEmptyContent,
            ]}
            ListEmptyComponent={renderEmptyState}
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

  headerControls: {
    flexDirection: "row",
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

  categoryHint: {
    marginTop: Spacing.xs,
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.medium,
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

  listContent: {
    paddingBottom: scale(70),
  },

  listEmptyContent: {
    flexGrow: 1,
  },

  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: scale(90),
  },

  emptyCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.md,
  },

  emptyTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.bold,
  },

  emptyDesc: {
    fontSize: Fonts.size.md,
    lineHeight: 20,
  },
});
