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

import EventStatusChip from "../components/EventStatusChip";

const EventRow = memo(
    ({ item, onDelete, onToggleStatus, onOpen, actionLoading }) => {
        const colors = useAppTheme();
        const isBusy = actionLoading === item.id;

        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen(item)}>
                <Surface
                    style={[styles.cardContainer, { backgroundColor: colors.surface }]}
                    elevation={2}
                >
                    <View style={styles.imageContainer}>
                        {!!item?.images?.[0]?.url ? (
                            <Image
                                source={item.images[0].url}
                                style={styles.coverImage}
                                contentFit="cover"
                                transition={200}
                            />
                        ) : (
                            <View style={[styles.coverImage, styles.placeholderImage]} />
                        )}
                        <View style={styles.statusChipContainer}>
                            <EventStatusChip status={item.status} style={styles.statusChip} />
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.headerRow}>
                            <Text numberOfLines={1} style={styles.title}>
                                {item.title}
                            </Text>
                            <Text style={[styles.date, { color: colors.primary }]}>
                                {item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                            </Text>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={[styles.subtitle, { color: colors.textSecondary }]}
                        >
                            {item.location || "No location provided"}
                        </Text>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.actions}>
                            {item.status === "PENDING" && (
                                <>
                                    <Button
                                        mode="contained"
                                        compact
                                        icon="check"
                                        loading={isBusy}
                                        buttonColor={colors.secondary}
                                        onPress={() => onToggleStatus(item.id, "APPROVED")}
                                        style={styles.actionBtn}
                                        labelStyle={styles.btnLabel}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        mode="outlined"
                                        compact
                                        icon="close"
                                        loading={isBusy}
                                        textColor={colors.danger}
                                        style={[styles.actionBtn, { borderColor: colors.danger }]}
                                        onPress={() => onToggleStatus(item.id, "REJECTED")}
                                        labelStyle={styles.btnLabel}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}

                            {item.status === "APPROVED" && (
                                <>
                                    <Button
                                        mode="outlined"
                                        compact
                                        icon="close"
                                        loading={isBusy}
                                        textColor={colors.danger}
                                        style={[styles.actionBtn, { borderColor: colors.danger }]}
                                        onPress={() => onToggleStatus(item.id, "REJECTED")}
                                        labelStyle={styles.btnLabel}
                                    >
                                        Reject
                                    </Button>

                                    <IconButton
                                        icon="delete-outline"
                                        iconColor={colors.error}
                                        size={22}
                                        onPress={() => onDelete(item.id)}
                                        style={styles.iconBtn}
                                    />
                                </>
                            )}

                            {item.status === "REJECTED" && (
                                <>
                                    <Button
                                        mode="contained"
                                        compact
                                        icon="check"
                                        loading={isBusy}
                                        buttonColor={colors.secondary}
                                        onPress={() => onToggleStatus(item.id, "APPROVED")}
                                        style={styles.actionBtn}
                                        labelStyle={styles.btnLabel}
                                    >
                                        Approve
                                    </Button>

                                    <IconButton
                                        icon="delete-outline"
                                        iconColor={colors.error}
                                        size={22}
                                        onPress={() => onDelete(item.id)}
                                        style={styles.iconBtn}
                                    />
                                </>
                            )}
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
            <Appbar.Header elevated style={{ backgroundColor: colors.surface }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Manage Events" />

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <IconButton icon="sort" onPress={() => setMenuVisible(true)} />
                    }
                >
                    {SORT_OPTIONS.map((opt) => (
                        <Menu.Item
                            key={opt.value}
                            title={opt.label}
                            onPress={() => {
                                setSort(opt.value);
                                setMenuVisible(false);
                            }}
                            trailingIcon={sort === opt.value ? "check" : undefined}
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
                    inputStyle={{ minHeight: 0 }}
                />

                <View style={styles.filterRow}>
                    {STATUS_FILTERS.map((s) => {
                        const val = s === "All" ? "all" : s;
                        const isActive = statusFilter === val;

                        return (
                            <Chip
                                key={s}
                                mode={isActive ? "flat" : "outlined"}
                                selected={isActive}
                                onPress={() => setStatusFilter(val)}
                                style={styles.chip}
                                showSelectedOverlay
                                textStyle={{ fontSize: 12 }}
                            >
                                {s}
                            </Chip>
                        );
                    })}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
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
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.center}>
                                <Text style={{ color: colors.textSecondary }}>
                                    No events found
                                </Text>
                            </View>
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
    },

    header: {
        padding: Spacing.md,
        paddingBottom: Spacing.sm,
    },

    search: {
        borderRadius: Radius.full,
        height: scale(45),
        elevation: 2,
    },

    filterRow: {
        flexDirection: "row",
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
        flexWrap: "wrap",
        gap: Spacing.sm,
    },

    chip: {
        borderRadius: Radius.full,
        height: 32,
    },

    cardContainer: {
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
        borderRadius: Radius.xl,
        overflow: "hidden",
        backgroundColor: "white",
    },

    imageContainer: {
        height: scale(160),
        width: "100%",
        position: "relative",
    },

    coverImage: {
        width: "100%",
        height: "100%",
    },

    placeholderImage: {
        backgroundColor: "#eee",
    },

    statusChipContainer: {
        position: "absolute",
        top: Spacing.sm,
        right: Spacing.sm,
    },

    statusChip: {
        height: 28,
    },

    cardContent: {
        padding: Spacing.md,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },

    title: {
        fontWeight: Fonts.weight.bold,
        fontSize: Fonts.size.lg,
        flex: 1,
        marginRight: Spacing.sm,
    },

    date: {
        fontSize: Fonts.size.xs,
        fontWeight: "600",
    },

    subtitle: {
        fontSize: Fonts.size.sm,
        marginBottom: Spacing.xs,
    },

    divider: {
        height: 1,
        marginVertical: Spacing.md,
        opacity: 0.5,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: Spacing.sm,
    },

    actionBtn: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.xs,
    },

    btnLabel: {
        fontSize: 12,
        marginVertical: 6,
    },

    iconBtn: {
        margin: 0,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.xl,
    },

    listContent: {
        paddingBottom: scale(80),
    },
});
