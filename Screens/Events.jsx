import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Surface,
  Text,
  ActivityIndicator,
  Chip,
  Menu,
  IconButton,
} from "react-native-paper";
import API from "../api/api";
import { LinearGradient } from "expo-linear-gradient";

const LIMIT = 8;

// ---------------------- DATE FORMATTER ----------------------
const formatEventDate = (rawDate) => {
  if (!rawDate) return {};

  const date = new Date(rawDate);
  const now = new Date();

  // Day Name
  const day = date.toLocaleDateString("en-US", { weekday: "long" });

  // Full Date
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Time
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Days until event
  const diffTime = date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let startsIn = "";
  if (diffDays === 0) startsIn = "Starts Today";
  else if (diffDays === 1) startsIn = "Starts Tomorrow";
  else if (diffDays > 1) startsIn = `Starts in ${diffDays} days`;
  else startsIn = "Event Passed";

  return { day, formattedDate, time, startsIn };
};

export default function EventScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const [sortVisible, setSortVisible] = useState(false);
  const [sortType, setSortType] = useState("recent");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ---------- Fetch events ----------
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

        const eventData = res.data.events || [];
        const categoryData = res.data.categories || [];

        if (reset) {
          setEvents(eventData);
          setPage(2);
        } else {
          setEvents((prev) => [...prev, ...eventData]);
          setPage((prev) => prev + 1);
        }

        setCategories(["all", ...categoryData]);
        setTotalEvents(res.data.total || 0);
      } catch (error) {
        console.log("Fetch events error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, sortType, page]
  );

  // Fetch on filter/sort change
  useEffect(() => {
    fetchEvents(true);
  }, [activeCategory, sortType]);

  const loadMore = () => {
    if (events.length >= totalEvents || loadingMore) return;

    setLoadingMore(true);
    fetchEvents(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents(true);
  }, []);

  // ---------- Shimmer Loader ----------
  const ShimmerCard = () => (
    <View style={styles.shimmerCard}>
      <LinearGradient
        colors={["#f5f5f5", "#e0e0e0", "#f5f5f5"]}
        style={styles.shimmerGradient}
      />
    </View>
  );

  // ---------- Event Card ----------
  const renderItem = useCallback(
    ({ item }) => {
      const { day, formattedDate, time, startsIn } = formatEventDate(item.date);

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("EventDetail", { id: item.id })}
        >
          <Surface style={styles.cardShadow}>
            <View style={styles.cardContainer}>
              {item.images?.length ? (
                <Image
                  source={{ uri: item.images[0].url }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={styles.noImageBox}>
                  <Text style={{ color: "#aaa" }}>No Image</Text>
                </View>
              )}

              <View style={styles.cardContent}>

                {/* Title */}
                <Text variant="titleMedium" style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.cardInfo}>📍 {item.location}</Text>

                {/* Date Format (new layout) */}
                <View style={styles.dateWrapper}>
                  <Text style={styles.dateText}>🗓 Date: {formattedDate}</Text>
                  <Text style={styles.dateText}>⏰ Time: {time}</Text>
                  <Text style={styles.dateText}>📅 Day: {day}</Text>

                  {/* Starts in X days */}
                  <Text style={styles.startsIn}>{startsIn}</Text>
                </View>
              </View>
            </View>
          </Surface>
        </TouchableOpacity>
      );
    },
    []
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#0057ff", "#3a86ff"]} style={styles.header}>
        <Text style={styles.headerTitle}>Campus Events</Text>
        <Text style={styles.headerSubtitle}>Discover what's happening</Text>

        <Menu
          visible={sortVisible}
          onDismiss={() => setSortVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              size={28}
              color="#fff"
              onPress={() => setSortVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => setSortType("recent")} title="Recent First" />
          <Menu.Item onPress={() => setSortType("location")} title="By Location" />
          <Menu.Item onPress={() => setSortType("duration")} title="By Duration" />
        </Menu>
      </LinearGradient>

      {/* Category Filter */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Chip
            selected={activeCategory === item}
            onPress={() => setActiveCategory(item)}
            style={[
              styles.categoryChipFilter,
              activeCategory === item && styles.categoryChipActive,
            ]}
            textStyle={styles.chipText}
          >
            {item.toUpperCase()}
          </Chip>
        )}
      />

      {/* Events List */}
      {loading ? (
        <>
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loadingMore && <ActivityIndicator style={{ marginTop: 10 }} />
          }
        />
      )}
    </View>
  );
}

// --------------------- STYLES ---------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },

  header: {
    padding: 25,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "700" },
  headerSubtitle: { color: "#fff", opacity: 0.85, marginBottom: 10 },

  categoryList: {
    paddingVertical: 12,
    paddingLeft: 10,
  },
  categoryChipFilter: {
    marginRight: 10,
    backgroundColor: "#e6e8f0",
    height: 38,
  },
  categoryChipActive: {
    backgroundColor: "#0057ff",
  },

  cardShadow: {
    margin: 12,
    elevation: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  cardContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 260 },
  noImageBox: {
    width: "100%",
    height: 260,
    backgroundColor: "#ececec",
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: { padding: 15 },
  cardTitle: { fontWeight: "700", fontSize: 20, marginBottom: 4 },

  dateWrapper: { marginTop: 6 },
  dateText: { color: "#555", marginTop: 2 },
  startsIn: {
    marginTop: 6,
    fontWeight: "700",
    color: "#0057ff",
  },

  shimmerCard: {
    height: 260,
    margin: 12,
    borderRadius: 16,
    backgroundColor: "#ddd",
  },
  shimmerGradient: {
    width: "100%",
    height: "100%",
  },
});
