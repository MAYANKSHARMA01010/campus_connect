import React, { useCallback, useEffect, useReducer, memo } from "react";

import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
    TouchableOpacity,
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

import {
    eventReducer,
    initialState,
    fetchAdminEvents,
    updateEventStatus,
    deleteEvent,
} from "../reducer/eventReducer";

const LIMIT = 10;

const STATUS_FILTERS = ["All", "APPROVED", "PENDING", "REJECTED"];

const SORT_OPTIONS = [
    { label: "Newest", value: "recent" },
    { label: "Oldest", value: "oldest" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
    { label: "A - Z", value: "az" },
];

const EventRow = memo(
    ({ item, onDelete, onToggleStatus, onOpen, actionLoading }) => {
        const statusColor =
            item.status === "APPROVED"
                ? "#4CAF50"
                : item.status === "PENDING"
                    ? "#FF9800"
                    : "#F44336";

        const isBusy = actionLoading === item.id;

        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen(item)}>
                <Surface style={styles.cardContainer}>
                    <View style={styles.card}>
                        {!!item?.images?.[0]?.url && (
                            <Image
                                source={item.images[0].url}
                                style={styles.thumb}
                                contentFit="cover"
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
                                {item.status === "PENDING" && (
                                    <>
                                        <Button
                                            compact
                                            mode="contained"
                                            loading={isBusy}
                                            onPress={() => onToggleStatus(item.id, "APPROVED")}
                                        >
                                            Approve
                                        </Button>

                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor="#F44336"
                                            onPress={() => onToggleStatus(item.id, "REJECTED")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {item.status === "APPROVED" && (
                                    <>
                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor="#F44336"
                                            onPress={() => onToggleStatus(item.id, "REJECTED")}
                                        >
                                            Reject
                                        </Button>

                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor="#F44336"
                                            onPress={() => onDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}

                                {item.status === "REJECTED" && (
                                    <>
                                        <Button
                                            compact
                                            mode="contained"
                                            loading={isBusy}
                                            onPress={() => onToggleStatus(item.id, "APPROVED")}
                                        >
                                            Approve
                                        </Button>

                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor="#F44336"
                                            onPress={() => onDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </Surface>
            </TouchableOpacity>
        );
    }
);

export default function ManageEventsScreen({ navigation }) {
    const [state, dispatch] = useReducer(eventReducer, initialState);

    const { events, total, loading, refreshing, loadingMore, actionLoading } =
        state;

    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [sort, setSort] = React.useState("recent");
    const [page, setPage] = React.useState(1);
    const [menuVisible, setMenuVisible] = React.useState(false);

    const loadEvents = useCallback(
        async (reset = false) => {
            const newPage = reset ? 1 : page;

            await fetchAdminEvents({
                dispatch,
                search,
                statusFilter,
                sort,
                page: newPage,
                limit: LIMIT,
                reset,
            });

            setPage(reset ? 2 : page + 1);
        },
        [dispatch, search, statusFilter, sort, page]
    );

    useEffect(() => {
        loadEvents(true);
    }, [search, statusFilter, sort]);

    const onRefresh = () => loadEvents(true);

    const loadMore = () => {
        if (loadingMore || events.length >= total) return;
        loadEvents(false);
    };

    const onToggleStatus = (id, status) =>
        updateEventStatus(dispatch, id, status, () => loadEvents(true));

    const onDelete = (id) => {
        Alert.alert("Delete Event?", "This event will be removed.", [
            { text: "Cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteEvent(dispatch, id, () => loadEvents(true)),
            },
        ]);
    };

    const onOpen = (event) =>
        navigation.navigate("EventDetail", { id: event.id });

    const renderItem = ({ item }) => (
        <EventRow
            item={item}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onOpen={onOpen}
            actionLoading={actionLoading}
        />
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
                    <Menu.Item title="Refresh" onPress={onRefresh} />
                </Menu>
            </Appbar.Header>

            <View style={styles.header}>
                <Searchbar
                    placeholder="Search events..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.search}
                />

                <View style={styles.filterRow}>
                    {STATUS_FILTERS.map((s) => (
                        <Chip
                            key={s}
                            selected={statusFilter === s.toLowerCase()}
                            onPress={() => setStatusFilter(s === "All" ? "all" : s)}
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
                    keyExtractor={(i) => i.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        loadingMore && <ActivityIndicator style={{ marginVertical: 14 }} />
                    }
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F6F8FB" },
    header: { padding: 12 },
    search: { borderRadius: 14 },
    filterRow: {
        flexDirection: "row",
        marginTop: 10,
        gap: 8,
        flexWrap: "wrap",
    },
    cardContainer: {
        margin: 10,
        borderRadius: 14,
        backgroundColor: "#fff",
        elevation: 3,
    },
    card: {
        flexDirection: "row",
        overflow: "hidden",
        borderRadius: 14,
    },
    thumb: { width: 90, height: "100%" },
    cardBody: { flex: 1, padding: 10 },
    title: { fontWeight: "700", fontSize: 16 },
    subtitle: { color: "#666" },
    badge: {
        marginTop: 6,
        paddingVertical: 2,
        paddingHorizontal: 8,
        fontSize: 11,
        color: "#fff",
        fontWeight: "700",
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    actions: {
        marginTop: 12,
        flexDirection: "row",
        gap: 6,
        justifyContent: "flex-end",
    },
    center: { flex: 1, justifyContent: "center" },
    listContent: { paddingBottom: 70 },
});
