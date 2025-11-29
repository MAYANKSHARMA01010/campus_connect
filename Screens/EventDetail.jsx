import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    View,
    StyleSheet,
    RefreshControl,
    ScrollView,
    Share,
    Linking,
} from "react-native";
import {
    Appbar,
    Text,
    ActivityIndicator,
    Surface,
    Button,
    Chip,
    Divider,
} from "react-native-paper";
import { getEventById } from "../api/events";

import EventHeroSlider from "../components/EventHeroSlider";

export default function EventDetailsScreen({ route, navigation }) {
    const { id } = route.params;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    const loadEvent = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getEventById(id);
            setEvent(data?.event ?? data?.events?.[0] ?? data);
        } catch (err) {
            console.log("Event fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        loadEvent();
    }, [loadEvent]);

    const onRefresh = () => {
        setRefreshing(true);
        loadEvent();
    };

    const formatDate = useCallback((d) => {
        if (!d) return "-";
        return new Date(d).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, []);

    const formatTime = useCallback((d, t) => {
        if (t) return t;
        if (!d) return "-";
        return new Date(d).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
        });
    }, []);

    const images = useMemo(() => event?.images ?? [], [event]);

    const onSharePress = useCallback(async () => {
        try {
            await Share.share({
                message: `${event?.title}
${formatDate(event?.date)} • ${formatTime(event?.date, event?.time)}
${timeLeft}

${event?.location || ""}

${event?.description || ""}`,
            });
        } catch (err) {
            console.log(err);
        }
    }, [event, formatDate, formatTime, timeLeft]);

    const updateTimeLeft = useCallback(() => {
        if (!event?.date) return setTimeLeft("");

        const now = new Date();
        const target = new Date(event.date);
        const diff = target - now;

        if (diff <= 0) return setTimeLeft("Event started");

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        const parts = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        parts.push(`${minutes}m`);

        setTimeLeft(`Starts in ${parts.join(" ")}`);
    }, [event]);

    useEffect(() => {
        updateTimeLeft();
        const timer = setInterval(updateTimeLeft, 60000);
        return () => clearInterval(timer);
    }, [updateTimeLeft]);

    const handleCallHost = () => {
        if (!event?.contact) return;
        Linking.openURL(`tel:${event.contact}`);
    };

    const handleEmailHost = () => {
        const email = event?.email || event?.hostEmail;
        if (!email) return;
        Linking.openURL(`mailto:${email}`);
    };

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

    return (
        <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={event.title || "Event"} />
            </Appbar.Header>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <EventHeroSlider images={images} onSharePress={onSharePress} />

                <View style={styles.section}>
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <View style={styles.rowWrap}>
                        {!!event.category && (
                            <Chip style={styles.chip}>{event.category}</Chip>
                        )}
                        {!!event.subCategory && (
                            <Chip style={styles.chip}>{event.subCategory}</Chip>
                        )}
                        {!!event.date && (
                            <Chip style={styles.chip}>{formatDate(event.date)}</Chip>
                        )}
                        {!!timeLeft && <Chip style={styles.chip}>{timeLeft}</Chip>}
                    </View>
                </View>

                <View style={styles.cardsRow}>
                    <Surface style={styles.infoCard}>
                        <View style={styles.innerClip}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{formatDate(event.date)}</Text>
                            {!!timeLeft && <Text style={styles.subValue}>{timeLeft}</Text>}
                        </View>
                    </Surface>

                    <Surface style={styles.infoCard}>
                        <View style={styles.innerClip}>
                            <Text style={styles.label}>Time</Text>
                            <Text style={styles.value}>
                                {formatTime(event.date, event.time)}
                            </Text>
                        </View>
                    </Surface>
                </View>

                <View style={styles.cardsRow}>
                    <Surface style={[styles.infoCard, { flex: 1 }]}>
                        <View style={styles.innerClip}>
                            <Text style={styles.label}>Location</Text>
                            <Text style={styles.value}>{event.location || "—"}</Text>
                            <Button mode="outlined" compact icon="map-marker">
                                Open Maps
                            </Button>
                        </View>
                    </Surface>

                    <Surface style={[styles.infoCard, { flex: 1 }]}>
                        <View style={styles.innerClip}>
                            <Text style={styles.label}>Host</Text>
                            <Text style={styles.value}>{event.hostName || "—"}</Text>

                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Button
                                    mode="outlined"
                                    compact
                                    icon="phone"
                                    onPress={handleCallHost}
                                    style={{ flex: 1, marginRight: 8 }}
                                    disabled={!event?.contact}
                                >
                                    Call
                                </Button>

                                <Button
                                    mode="outlined"
                                    compact
                                    icon="email"
                                    onPress={handleEmailHost}
                                    style={{ flex: 1 }}
                                    disabled={!(event?.email || event?.hostEmail)}
                                >
                                    Email
                                </Button>
                            </View>
                        </View>
                    </Surface>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>About</Text>
                    <Surface style={styles.surfaceBox}>
                        <Text style={styles.desc}>
                            {event.description || "No description provided."}
                        </Text>
                    </Surface>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Details</Text>

                    <Surface style={styles.detailsSurface}>
                        <View style={styles.detailsBoxInner}>
                            <Detail label="Category" value={event.category} />
                            <Detail label="Sub-category" value={event.subCategory} />
                            <Detail label="Contact" value={event.contact} />
                            <Detail
                                label="Email"
                                value={event.email || event.hostEmail}
                            />
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

const Detail = ({ label, value }) => (
    <>
        <View style={styles.detailRow}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || "—"}</Text>
        </View>
        <Divider />
    </>
);

const styles = StyleSheet.create({
    section: { paddingHorizontal: 20, paddingTop: 20 },

    eventTitle: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 10,
        color: "#111",
    },

    rowWrap: { flexDirection: "row", flexWrap: "wrap" },

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
        color: "#616161",
        fontSize: 13,
    },

    value: {
        color: "#000",
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 12,
        marginTop: 4,
    },

    subValue: {
        color: "#777",
        fontSize: 13,
        marginTop: -4,
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
    },

    desc: {
        color: "#444",
        fontSize: 16,
        lineHeight: 22,
    },

    detailsSurface: {
        backgroundColor: "#fff",
        borderRadius: 16,
    },

    detailsBoxInner: {
        borderRadius: 16,
        overflow: "hidden",
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
