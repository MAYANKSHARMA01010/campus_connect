import { useReducer, useEffect, useCallback } from "react";
import { eventAPI } from "../api/api";
import { Alert } from "react-native";
import { eventReducer, initialState } from "../reducer/eventReducer";

export const useMyEvents = () => {
    const [state, dispatch] = useReducer(eventReducer, initialState);

    const fetchMyEvents = useCallback(async () => {
        try {
            dispatch({ type: "FETCH_START", reset: true });
            const data = await eventAPI.getMy();

            dispatch({
                type: "FETCH_SUCCESS",
                reset: true,
                payload: {
                    events: data,
                    total: data.length,
                },
            });
        } catch (err) {
            Alert.alert("Error", "Failed to load your events");
            dispatch({ type: "ACTION_END" }); // Just to stop loading if needed, though FETCH_START handles it
        }
    }, []);

    useEffect(() => {
        fetchMyEvents();
    }, [fetchMyEvents]);

    const setFilter = (filter) => {
        dispatch({ type: "SET_FILTER", payload: filter });
    };

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
                            dispatch({ type: "ACTION_START", payload: safeId });
                            await eventAPI.deleteMy(safeId);
                            await fetchMyEvents();
                            resolve(true);
                        } catch {
                            Alert.alert("Error", "Failed to delete event");
                            resolve(false);
                        } finally {
                            dispatch({ type: "ACTION_END" });
                        }
                    },
                },
            ]);
        });
    };

    return {
        events: state.filteredEvents, // Return filtered events by default
        allEvents: state.events,
        loading: state.loading,
        filter: state.filter,
        setFilter,
        fetchMyEvents,
        deleteEvent,
    };
};
