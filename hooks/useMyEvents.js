import { useState, useEffect, useCallback } from "react";
import { eventAPI } from "../api/api";
import { Alert } from "react-native";

export const useMyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await eventAPI.getMy();
            setEvents(data);
        } catch (err) {
            Alert.alert("Error", "Failed to load your events");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyEvents();
    }, [fetchMyEvents]);

    const deleteEvent = async (id) => {
        const safeId = Number(id);
        if (!safeId || Number.isNaN(safeId)) {
            Alert.alert("Invalid event id");
            return;
        }

        return new Promise((resolve) => {
            Alert.alert("Delete Event", "Are you sure?", [
                { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await eventAPI.deleteMy(safeId);
                            await fetchMyEvents();
                            resolve(true);
                        } catch {
                            Alert.alert("Error", "Failed to delete event");
                            resolve(false);
                        }
                    },
                },
            ]);
        });
    };

    return {
        events,
        loading,
        fetchMyEvents,
        deleteEvent,
    };
};
