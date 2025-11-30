import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
} from "react-native";

import {
    Appbar,
    Text,
    Searchbar,
    Chip,
    Menu,
    ActivityIndicator,
    Surface,
    Button,
    IconButton,
} from "react-native-paper";

import { Image } from "expo-image";
import API from "../api/api";

const LIMIT = 10;

const STATUS_FILTERS = ["all", "APPROVED", "PENDING", "REJECTED"];

const SORT_OPTIONS = [
    { label: "Newest", value: "recent" },
    { label: "Oldest", value: "oldest" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
    { label: "A - Z", value: "az" },
];

const EventRow = memo(({ item, onDelete, onToggleStatus }) => {
    const statusColor =
        item.status === "APPROVED"
            ? "#4CAF50"
            : item.status === "PENDING"
                ? "#FF9800"
                : "#F44336";

    return (
        <Surface style={styles.cardContainer}>
            <View style={styles.card}>
                {!!item?.images?.[0]?.url && (
                    <Image
                        source={item.images[0].url}
                        style={styles.thumb}
                        contentFit="cover"
                        cachePolicy="disk"
                        transition={200}
                    />
                )}

                <View style={styles.cardBody}>
                    <Text numberOfLines={1} style={styles.title}>
                        {item.title}
                    </Text>

                    <Text style={styles.subtitle}>
                        {item.location || "No location"}
                    </Text>

                    <Text style={[styles.badge, { backgroundColor: statusColor }]}>
                        {item.status}
                    </Text>

                    <View style={styles.actions}>
                        <Button
                            compact
                            mode="contained"
                            onPress={() =>
                                onToggleStatus(
                                    item,
                                    item.status === "APPROVED" ? "REJECTED" : "APPROVED"
                                )
                            }
                        >
                            {item.status === "APPROVED" ? "Reject" : "Approve"}
                        </Button>

                        <Button
                            compact
                            textColor="#F44336"
                            onPress={() => onDelete(item)}
                        >
                            Delete
                        </Button>
                    </View>
                </View>
            </View>
        </Surface>
    );
});

export default function ManageEventsScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sort, setSort] = useState("recent");
    const [menuVisible, setMenuVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const activeRequest = useRef(0);

    const loadEvents = useCallback(
        async (reset = false) => {
            const reqId = ++activeRequest.current;
            const currentPage = reset ? 1 : page;

            try {
                if (reset) {
                    setLoading(true);
                    setPage(1);
                }

                const res = await API.get("/events/admin", {
                    params: {
                        search,
                        status:
                            statusFilter !== "all" ? statusFilter : undefined,
                        sortBy: sort,
                        pageNumber: currentPage,
                        pageSize: LIMIT,
                    },
                });

                if (activeRequest.current !== reqId) return;

                const list = res?.data?.events || [];

                setTotal(res?.data?.total || 0);

                reset
                    ? setEvents(list)
                    : setEvents((prev) => [...prev, ...list]);

                setPage((p) => p + 1);
            } catch (err) {
                console.log(
                    "ADMIN FETCH ERROR:",
                    err?.response?.data || err.message
                );
            } finally {
                if (activeRequest.current === reqId) {
                    setLoading(false);
                    setRefreshing(false);
                    setLoadingMore(false);
                }
            }
        },
        [search, statusFilter, sort, page]
    );

    useEffect(() => {
        loadEvents(true);
    }, [search, statusFilter, sort]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadEvents(true);
    }, [loadEvents]);

    const loadMore = useCallback(() => {
        if (loadingMore || events.length >= total) return;
        setLoadingMore(true);
        loadEvents(false);
    }, [loadingMore, events.length, total, loadEvents]);

    const onDelete = useCallback((event) => {
        Alert.alert("Delete Event?", `"${event.title}" will be removed.`, [
            { text: "Cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await API.delete(`/events/${event.id}`);
                    onRefresh();
                },
            },
        ]);
    }, []);

    const onToggleStatus = useCallback(async (event, status) => {
        await API.patch(`/events/${event.id}/status`, { status });
        onRefresh();
    }, []);

    const renderItem = useCallback(
        ({ item }) => (
            <EventRow
                item={item}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
            />
        ),
        []
    );

    return (
        <View style={styles.root}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Manage Events" />

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            onPress={() => setMenuVisible(true)}
                        />
                    }
                >
                    {SORT_OPTIONS.map((opt) => (
                        <Menu.Item
                            key={opt.value}
                            title={`Sort • ${opt.label}`}
                            onPress={() => {
                                setSort(opt.value);
                                setMenuVisible(false);
                            }}
                        />
                    ))}

                    <Menu.Item
                        title="Refresh"
                        onPress={() => {
                            setMenuVisible(false);
                            onRefresh();
                        }}
                    />
                </Menu>
            </Appbar.Header>

            <View style={styles.header}>
                <Searchbar
                    placeholder="Search events…"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.search}
                    autoCapitalize="none"
                />

                <View style={styles.filterRow}>
                    {STATUS_FILTERS.map((s) => (
                        <Chip
                            key={s}
                            selected={statusFilter === s}
                            onPress={() => setStatusFilter(s)}
                            style={styles.chip}
                        >
                            {s}
                        </Chip>
                    ))}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={events}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    windowSize={10}
                    removeClippedSubviews
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={styles.listContent}
                    ListFooterComponent={
                        loadingMore && (
                            <ActivityIndicator style={{ marginVertical: 14 }} />
                        )
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F6F8FB",
    },
    header: {
        padding: 12,
    },
    search: {
        borderRadius: 14,
    },
    filterRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
        flexWrap: "wrap",
    },
    chip: {
        borderRadius: 14,
    },
    cardContainer: {
        margin: 10,
        borderRadius: 14,
        elevation: 3,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "row",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    thumb: {
        width: 90,
        height: "100%",
    },
    cardBody: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontWeight: "700",
        fontSize: 16,
    },
    subtitle: {
        color: "#666",
        marginTop: 2,
    },
    badge: {
        marginTop: 6,
        alignSelf: "flex-start",
        borderRadius: 8,
        paddingVertical: 2,
        paddingHorizontal: 8,
        fontSize: 11,
        color: "#fff",
        fontWeight: "700",
    },
    actions: {
        marginTop: 12,
        flexDirection: "row",
        gap: 6,
        justifyContent: "flex-end",
    },
    center: {
        flex: 1,
        justifyContent: "center",
    },
    listContent: {
        paddingBottom: 70,
    },
});
