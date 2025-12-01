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

import { useAppTheme } from "../theme/useAppTheme";
import { Fonts, Spacing, Radius, Shadows } from "../theme/theme";
import { scale } from "../theme/layout";

export default function EventDetailsScreen({ route, navigation }) {
    const { id } = route.params;
    const colors = useAppTheme();

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
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );

    if (!event)
        return (
            <View style={styles.center}>
                <Text>No event found</Text>
            </View>
        );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Appbar.Header elevated={true}>
                <Appbar.BackAction
                    color={colors.textPrimary}
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content title={event.title || "Event"} />
            </Appbar.Header>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <EventHeroSlider images={images} onSharePress={onSharePress} />

                <View style={styles.section}>
                    <Text style={[styles.eventTitle, { color: colors.textPrimary }]}>
                        {event.title}
                    </Text>

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
                    <InfoCard
                        label="Date"
                        value={formatDate(event.date)}
                        subValue={timeLeft}
                    />
                    <InfoCard label="Time" value={formatTime(event.date, event.time)} />
                </View>

                <View style={styles.cardsRow}>
                    <InfoCard
                        label="Location"
                        value={event.location || "—"}
                        extra={
                            <Button mode="outlined" compact icon="map-marker">
                                Open Maps
                            </Button>
                        }
                    />

                    <InfoCard
                        label="Host"
                        value={event.hostName || "—"}
                        extra={
                            <View style={{ flexDirection: "row", marginTop: Spacing.sm }}>
                                <Button
                                    mode="outlined"
                                    compact
                                    icon="phone"
                                    onPress={handleCallHost}
                                    style={{ flex: 1, marginRight: Spacing.sm }}
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
                        }
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.heading, { color: colors.textPrimary }]}>
                        About
                    </Text>

                    <Surface
                        style={[styles.surfaceBox, { backgroundColor: colors.surface }]}
                    >
                        <Text style={styles.desc}>
                            {event.description || "No description provided."}
                        </Text>
                    </Surface>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.heading, { color: colors.textPrimary }]}>
                        Details
                    </Text>

                    <Surface style={styles.detailsSurface}>
                        <View style={styles.detailsBoxInner}>
                            <Detail label="Category" value={event.category} />
                            <Detail label="Sub category" value={event.subCategory} />
                            <Detail label="Contact" value={event.contact} />
                            <Detail label="Email" value={event.email || event.hostEmail} />
                        </View>
                    </Surface>
                </View>

                <View style={{ padding: Spacing.xl }}>
                    <Button
                        mode="contained"
                        style={styles.registerBtn}
                        buttonColor={colors.primary}
                    >
                        RSVP / Register
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const InfoCard = ({ label, value, subValue, extra }) => {
    const colors = useAppTheme();

    return (
        <Surface style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.innerClip}>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color: colors.textPrimary }]}>
                    {value || "—"}
                </Text>

                {!!subValue && <Text style={styles.subValue}>{subValue}</Text>}
                {extra}
            </View>
        </Surface>
    );
};

const Detail = ({ label, value }) => {
    const colors = useAppTheme();

    return (
        <>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color: colors.textPrimary }]}>
                    {value || "—"}
                </Text>
            </View>
            <Divider />
        </>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
    },

    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    chip: {
        marginRight: Spacing.sm,
        marginBottom: Spacing.sm,
    },

    eventTitle: {
        fontSize: scale(26),
        fontWeight: Fonts.weight.bold,
        marginBottom: Spacing.sm,
    },

    cardsRow: {
        flexDirection: "row",
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
    },

    infoCard: {
        flex: 1,
        borderRadius: Radius.lg,
        marginRight: Spacing.lg,
        ...Shadows.card,
    },

    innerClip: {
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        overflow: "hidden",
    },

    label: {
        color: "#777",
        fontSize: Fonts.size.sm,
    },

    value: {
        fontSize: Fonts.size.lg,
        fontWeight: Fonts.weight.bold,
        marginBottom: Spacing.sm,
        marginTop: Spacing.xs,
    },

    subValue: {
        fontSize: Fonts.size.sm,
        color: "#777",
        marginTop: -Spacing.xs,
    },

    heading: {
        fontSize: Fonts.size.xl,
        fontWeight: Fonts.weight.bold,
        marginBottom: Spacing.md,
    },

    surfaceBox: {
        padding: Spacing.lg,
        borderRadius: Radius.lg,
        ...Shadows.card,
    },

    desc: {
        color: "#555",
        fontSize: Fonts.size.md,
        lineHeight: 22,
    },

    detailsSurface: {
        borderRadius: Radius.lg,
        ...Shadows.card,
    },

    detailsBoxInner: {
        borderRadius: Radius.lg,
        overflow: "hidden",
    },

    detailRow: {
        padding: Spacing.lg,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    registerBtn: {
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
