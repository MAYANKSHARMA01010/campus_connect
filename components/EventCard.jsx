import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Surface, Text } from "react-native-paper";
import { Image } from "expo-image";

const formatEventDate = (rawDate) => {
    if (!rawDate) return {};

    const date = new Date(rawDate);
    const now = new Date();

    const day = date.toLocaleDateString("en-US", { weekday: "long" });

    const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const startOfDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const startOfNow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const diffDays = Math.floor(
        (startOfDate - startOfNow) / (1000 * 60 * 60 * 24)
    );

    let startsIn = "";

    if (diffDays === 0) startsIn = "Starts Today";
    else if (diffDays === 1) startsIn = "Starts Tomorrow";
    else if (diffDays > 1) startsIn = `Starts in ${diffDays} days`;
    else startsIn = "Event Passed";

    return { day, formattedDate, time, startsIn };
};

const EventCard = memo(({ item, navigation }) => {
    const { day, formattedDate, time, startsIn } = formatEventDate(item.date);

    return (
        <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate("EventDetail", { id: item.id })}
        >
            <Surface style={styles.cardShadow}>
                <View style={styles.cardContainer}>
                    {item.images?.length ? (
                        <Image
                            source={item.images[0].url}
                            style={styles.cardImage}
                            contentFit="cover"
                            transition={250}
                            cachePolicy="disk"
                        />
                    ) : (
                        <View style={styles.noImageBox}>
                            <Text style={{ color: "#aaa" }}>No Image</Text>
                        </View>
                    )}

                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardInfo}>📍 {item.location}</Text>

                        <View style={styles.dateWrapper}>
                            <Text style={styles.dateText}>🗓 {formattedDate}</Text>
                            <Text style={styles.dateText}>⏰ {time}</Text>
                            <Text style={styles.dateText}>📅 {day}</Text>
                            <Text style={styles.startsIn}>{startsIn}</Text>
                        </View>
                    </View>
                </View>
            </Surface>
        </TouchableOpacity>
    );
});

export default EventCard;

const styles = StyleSheet.create({
    cardShadow: {
        backgroundColor: "#fff",
        borderRadius: 14,
        margin: 12,
        elevation: 4,
    },

    cardContainer: {
        borderRadius: 14,
        overflow: "hidden",
    },

    cardImage: {
        width: "100%",
        height: 350,
    },

    noImageBox: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ececec",
    },

    cardContent: {
        padding: 14,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "800",
    },

    cardInfo: {
        color: "#556",
        marginTop: 2,
    },

    dateWrapper: {
        marginTop: 8,
    },

    dateText: {
        color: "#555",
        marginVertical: 1,
    },

    startsIn: {
        fontWeight: "800",
        color: "#0057ff",
        marginTop: 5,
    },
});
