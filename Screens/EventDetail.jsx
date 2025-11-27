import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    ScrollView,
    RefreshControl,
    Share,
    Text as RNText,
} from "react-native";
import {
    Appbar,
    Text,
    ActivityIndicator,
    Surface,
    IconButton,
    Button,
    Chip,
    Divider,
} from "react-native-paper";
import { getEventById } from "../api/events";

const { width } = Dimensions.get("window");

export default function EventDetailsScreen({ route, navigation }) {
    const { id } = route.params;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadEvent();
    }, []);

    async function loadEvent() {
        setLoading(true);
        try {
            const data = await getEventById(id);
            const evt = data?.event ?? data?.events?.[0] ?? data;
            setEvent(evt);
        } catch (err) {
            console.log("Event fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        loadEvent();
    };

    function formatDate(dateString) {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function formatTime(dateString, timeString) {
        if (timeString) return timeString;
        if (!dateString) return "-";
        return new Date(dateString).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    const images = event?.images ?? [];

    if (loading)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );

    if (!event)
        return (
            <View style={styles.center}>
                <Text>Event not found</Text>
            </View>
        );

    const onSharePress = async () => {
        try {
            await Share.share({
                message: `${event.title}\n${formatDate(event.date)} • ${formatTime(
                    event.date,
                    event.time
                )}\n${event.location || ""}\n\n${event.description || ""}`,
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={event.title || "Event"} />
            </Appbar.Header>

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ position: "relative" }}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        {images.length > 0 ? (
                            images.map((item, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: item.url }}
                                    style={styles.heroImage}
                                    resizeMode="cover"
                                />
                            ))
                        ) : (
                            <View style={[styles.heroImage, styles.placeholder]}>
                                <RNText style={{ color: "#666" }}>No images</RNText>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.topButtons}>
                        <IconButton
                            icon="bookmark-outline"
                            size={26}
                            mode="contained-tonal"
                            style={styles.roundBtn}
                            onPress={() => console.log("Bookmark")}
                        />
                        <View style={{ width: 8 }} />
                        <IconButton
                            icon="calendar-plus"
                            size={26}
                            mode="contained-tonal"
                            style={styles.roundBtn}
                            onPress={() => console.log("Calendar")}
                        />
                        <View style={{ width: 8 }} />
                        <IconButton
                            icon="share-variant"
                            size={26}
                            mode="contained-tonal"
                            style={styles.roundBtn}
                            onPress={onSharePress}
                        />
                    </View>

                    <View style={styles.dotsContainer}>
                        {(images.length > 0 ? images : [0]).map((_, i) => {
                            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                            const dotW = scrollX.interpolate({
                                inputRange,
                                outputRange: [6, 16, 6],
                                extrapolate: "clamp",
                            });
                            return <Animated.View key={i} style={[styles.dot, { width: dotW }]} />;
                        })}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <View style={styles.rowWrap}>
                        {event.category ? <Chip style={styles.chip}>{event.category}</Chip> : null}
                        {event.subCategory ? <Chip style={styles.chip}>{event.subCategory}</Chip> : null}
                        {event.date ? <Chip style={styles.chip}>{formatDate(event.date)}</Chip> : null}
                    </View>
                </View>

                <View style={styles.cardsRow}>
                    <Surface style={styles.infoCard}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>{formatDate(event.date)}</Text>
                    </Surface>

                    <Surface style={styles.infoCard}>
                        <Text style={styles.label}>Time</Text>
                        <Text style={styles.value}>{formatTime(event.date, event.time)}</Text>
                    </Surface>
                </View>

                <View style={styles.cardsRow}>
                    <Surface style={[styles.infoCard, { flex: 1 }]}>
                        <View style={styles.innerClip}>
                            <Text style={styles.label}>Location</Text>
                            <Text style={styles.value}>{event.location || "—"}</Text>
                            <Button mode="outlined" compact icon="map-marker" onPress={() => { }}>
                                Open Maps
                            </Button>
                        </View>
                    </Surface>

                    <Surface style={[styles.infoCard, { flex: 1 }]}>
                        <View style={styles.innerClip}>
                            <Text style={styles.label}>Host</Text>
                            <Text style={styles.value}>{event.hostName || "—"}</Text>
                            <Button mode="outlined" compact icon="phone" onPress={() => { }}>
                                Call
                            </Button>
                        </View>
                    </Surface>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>About</Text>
                    <Surface style={styles.surfaceBox}>
                        <Text style={styles.desc}>{event.description || "No description provided."}</Text>
                    </Surface>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Details</Text>

                    <Surface style={styles.detailsSurface}>
                        <View style={styles.detailsBoxInner}>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Category</Text>
                                <Text style={styles.value}>{event.category || "—"}</Text>
                            </View>
                            <Divider />
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Sub-category</Text>
                                <Text style={styles.value}>{event.subCategory || "—"}</Text>
                            </View>
                            <Divider />
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Contact</Text>
                                <Text style={styles.value}>{event.contact || "—"}</Text>
                            </View>
                        </View>
                    </Surface>
                </View>

                <View style={{ padding: 20 }}>
                    <Button mode="contained" style={styles.registerBtn}>
                        RSVP / Register
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    heroImage: {
        width,
        height: 500,
    },
    placeholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEE",
    },
    topButtons: {
        position: "absolute",
        top: 16,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 10,
    },
    roundBtn: {
        backgroundColor: "rgba(255,255,255,0.45)",
    },
    dotsContainer: {
        position: "absolute",
        bottom: 14,
        flexDirection: "row",
        alignSelf: "center",
    },
    dot: {
        height: 6,
        borderRadius: 6,
        backgroundColor: "#fff",
        marginHorizontal: 4,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    eventTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111",
        marginBottom: 10,
    },
    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip: {
        backgroundColor: "#EBEDFF",
        marginRight: 8,
        marginBottom: 8,
    },
    cardsRow: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    infoCard: {
        flex: 1,
        padding: 0,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 3,
        marginRight: 14,
    },
    innerClip: {
        padding: 18,
        borderRadius: 16,
        overflow: "hidden",
    },
    label: {
        fontSize: 13,
        color: "#616161",
    },
    value: {
        fontSize: 17,
        fontWeight: "700",
        marginTop: 4,
        marginBottom: 12,
        color: "#000",
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 14,
        color: "#111",
    },
    surfaceBox: {
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 2,
    },
    desc: {
        fontSize: 16,
        lineHeight: 22,
        color: "#444",
    },
    detailsSurface: {
        backgroundColor: "#fff",
        borderRadius: 16,
        elevation: 2,
        marginHorizontal: 0,
    },
    detailsBoxInner: {
        overflow: "hidden",
        borderRadius: 16,
    },
    detailRow: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    registerBtn: {
        paddingVertical: 8,
        borderRadius: 12,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
