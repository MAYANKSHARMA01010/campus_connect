import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
} from "react-native";
import {
    Text,
    ActivityIndicator,
    Appbar,
    Surface,
} from "react-native-paper";
import { getEventById } from "../api/events";

const { width } = Dimensions.get("window");

export default function EventDetailsScreen({ route, navigation }) {
    const { id } = route.params;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvent();
    }, []);

    async function loadEvent() {
        try {
            const data = await getEventById(id);
            setEvent(data.event);
        } catch (err) {
            console.log("Error fetching event:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.center}>
                <Text>Event not found.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={event.title} />
            </Appbar.Header>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                >
                    {event.images?.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img.url }}
                            style={styles.image}
                        />
                    ))}
                </ScrollView>

                <View style={styles.content}>
                    <Text style={styles.title}>{event.title}</Text>

                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.value}>{event.description}</Text>

                    <Surface style={styles.infoBox}>
                        <Text style={styles.label}>Category</Text>
                        <Text style={styles.value}>{event.category}</Text>

                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>
                            {new Date(event.date).toDateString()}
                        </Text>

                        <Text style={styles.label}>Time</Text>
                        <Text style={styles.value}>{event.time}</Text>

                        <Text style={styles.label}>Location</Text>
                        <Text style={styles.value}>{event.location}</Text>

                        <Text style={styles.label}>Host</Text>
                        <Text style={styles.value}>{event.hostName}</Text>

                        <Text style={styles.label}>Contact</Text>
                        <Text style={styles.value}>{event.contact}</Text>
                    </Surface>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width,
        height: 250,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 10,
    },
    label: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#888",
    },
    value: {
        fontSize: 16,
    },
    infoBox: {
        padding: 16,
        marginTop: 20,
        borderRadius: 12,
        elevation: 2,
    },
});
