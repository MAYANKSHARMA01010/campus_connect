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

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

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
        const colors = useAppTheme();

        const statusColor =
            item.status === "APPROVED"
                ? colors.secondary
                : item.status === "PENDING"
                    ? colors.accent
                    : colors.danger;

        const isBusy = actionLoading === item.id;

        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen(item)}>
                <Surface
                    style={[styles.cardContainer, { backgroundColor: colors.surface }]}
                >
                    <View style={styles.card}>
                        {!!item?.images?.[0]?.url && (
                            <Image
                                source={item.images[0].url}
                                style={styles.thumb}
                                contentFit="cover"
                                transition={200}
                            />
                        )}

                        <View style={styles.cardBody}>
                            <Text numberOfLines={1} style={styles.title}>
                                {item.title}
                            </Text>

                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
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
                                            buttonColor={colors.secondary}
                                            onPress={() => onToggleStatus(item.id, "APPROVED")}
                                        >
                                            Approve
                                        </Button>

                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor={colors.danger}
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
                                            textColor={colors.danger}
                                            onPress={() => onToggleStatus(item.id, "REJECTED")}
                                        >
                                            Reject
                                        </Button>

                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor={colors.danger}
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
                                            buttonColor={colors.secondary}
                                            onPress={() => onToggleStatus(item.id, "APPROVED")}
                                        >
                                            Approve
                                        </Button>

                                        <Button
                                            compact
                                            loading={isBusy}
                                            textColor={colors.danger}
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
    const colors = useAppTheme();
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
        <View style={[styles.root, { backgroundColor: colors.background }]}>
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
                    style={[styles.search, { backgroundColor: colors.surface }]}
                />

                <View style={styles.filterRow}>
                    {STATUS_FILTERS.map((s) => {
                        const val = s === "All" ? "all" : s;
                        const isActive = statusFilter === val;

                        return (
                            <Chip
                                key={s}
                                selected={isActive}
                                onPress={() => setStatusFilter(val)}
                            >
                                {s}
                            </Chip>
                        );
                    })}
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
                        loadingMore && (
                            <ActivityIndicator style={{ marginVertical: Spacing.md }} />
                        )
                    }
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },

    header: {
        padding: Spacing.md,
    },

    search: {
        borderRadius: Radius.md,
        ...Shadows.card,
    },

    filterRow: {
        flexDirection: "row",
        marginTop: Spacing.sm,
        flexWrap: "wrap",
        gap: Spacing.sm,
    },

    cardContainer: {
        margin: Spacing.sm,
        borderRadius: Radius.lg,
        ...Shadows.card,
    },

    card: {
        flexDirection: "row",
        overflow: "hidden",
        borderRadius: Radius.lg,
    },

    thumb: {
        width: scale(90),
        height: "100%",
    },

    cardBody: {
        flex: 1,
        padding: Spacing.sm,
    },

    title: {
        fontWeight: Fonts.weight.semiBold,
        fontSize: Fonts.size.md,
    },

    subtitle: {
        fontSize: Fonts.size.sm,
    },

    badge: {
        marginTop: Spacing.xs,
        paddingVertical: 2,
        paddingHorizontal: Spacing.sm,
        fontSize: Fonts.size.xs,
        color: "#fff",
        fontWeight: Fonts.weight.bold,
        borderRadius: Radius.sm,
        alignSelf: "flex-start",
    },

    actions: {
        marginTop: Spacing.sm,
        flexDirection: "row",
        gap: Spacing.sm,
        justifyContent: "flex-end",
    },

    center: {
        flex: 1,
        justifyContent: "center",
    },

    listContent: {
        paddingBottom: scale(70),
    },
});
