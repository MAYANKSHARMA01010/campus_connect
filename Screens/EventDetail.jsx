import React, { useEffect, useState } from "react";
import { ScrollView, View, Linking } from "react-native";
import {
    Card,
    Title,
    Paragraph,
    Button,
    ActivityIndicator,
} from "react-native-paper";
import { getAllEvents, getEventById, rsvpEvent } from "../api/events";

export default function EventDetail({ route, navigation }) {
    const { eventId } = route.params;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getEventById(eventId);
                if (mounted) setEvent(data);
            } 
            catch (err) {
                console.error(err);
            } 
            finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [eventId]);

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    if (!event)
        return <Paragraph style={{ padding: 20 }}>Event not found</Paragraph>;

    const toggleRsvp = async () => {
        setRsvpLoading(true);
        try {
            const newStatus = event.userRsvp ? "cancel" : "going";
            const updated = await rsvpEvent(event.id, newStatus);
            setEvent((prev) => ({
                ...prev,
                userRsvp: updated.userRsvp ?? !prev.userRsvp,
                attendeesCount:
                    updated.attendeesCount ??
                    (prev.userRsvp ? prev.attendeesCount - 1 : prev.attendeesCount + 1),
            }));
        } 
        catch (err) {
            console.error(err);
            alert("Unable to update RSVP. Try again.");
        } 
        finally {
            setRsvpLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
            <Card>
                {event.imageUrl && <Card.Cover source={{ uri: event.imageUrl }} />}
                <Card.Content>
                    <Title>{event.title}</Title>
                    <Paragraph style={{ marginTop: 8 }}>{event.description}</Paragraph>
                    <Paragraph style={{ marginTop: 8 }}>{event.startAt}</Paragraph>
                    <Paragraph style={{ marginTop: 8 }}>{event.locationName}</Paragraph>
                    <Paragraph style={{ marginTop: 8 }}>
                        Attendees: {event.attendeesCount ?? 0}
                    </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button
                        mode={event.userRsvp ? "contained" : "outlined"}
                        loading={rsvpLoading}
                        onPress={toggleRsvp}
                    >
                        {event.userRsvp ? "Going — Cancel" : "RSVP"}
                    </Button>
                    <Button
                        onPress={() =>
                            Linking.openURL(
                                `https://maps.google.com?q=${encodeURIComponent(
                                    event.locationName || ""
                                )}`
                            )
                        }
                    >
                        Open Map
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}
