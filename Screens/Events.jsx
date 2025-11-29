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

const LIMIT = 8;

export default function EventScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [sortType, setSortType] = useState("recent");
  const [sortVisible, setSortVisible] = useState(false);

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
    [page, activeCategory, sortType]
  );

  useEffect(() => {
    fetchEvents(true);
  }, [activeCategory, sortType]);

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

  const ShimmerCard = () => <View style={styles.shimmerCard} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      <LinearGradient
        colors={["#1337e6", "#3ab1ff"]}
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
                size={26}
                iconColor="#fff"
                onPress={() => setSortVisible(true)}
              />
            }
          >
            <Menu.Item title="Recent First" onPress={() => onSortSelect("recent")} />
            <Menu.Item title="By Location" onPress={() => onSortSelect("location")} />
            <Menu.Item title="By Duration" onPress={() => onSortSelect("duration")} />
          </Menu>
        </View>
      </LinearGradient>

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
              activeCategory === item && styles.categoryActive,
            ]}
            textStyle={styles.chipText}
          >
            {item.toUpperCase()}
          </Chip>
        )}
      />

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
            contentContainerStyle={{ paddingBottom: 70 }}
            ListFooterComponent={
              loadingMore && <ActivityIndicator style={{ marginVertical: 12 }} />
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
    backgroundColor: "#f7f9fc",
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 24,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#dfeaff",
    marginTop: 3,
  },

  categoryList: {
    paddingVertical: 12,
    paddingLeft: 10,
  },

  categoryChip: {
    backgroundColor: "#eef3ff",
    marginRight: 8,
    height: 38,
    justifyContent: "center",
  },

  categoryActive: {
    backgroundColor: "#ffffff",
  },

  chipText: {
    color: "#1b2a4a",
    fontWeight: "600",
  },

  shimmerCard: {
    height: 200,
    borderRadius: 14,
    margin: 12,
    backgroundColor: "#ddd",
  },
});
