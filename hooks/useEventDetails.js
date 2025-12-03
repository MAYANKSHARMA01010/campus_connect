import { useState, useCallback, useEffect } from "react";
import { eventAPI } from "../api/api";

export const useEventDetails = (id) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadEvent = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const data = await eventAPI.getById(id);
            setEvent(data?.event ?? data?.events?.[0] ?? data);
        } catch (err) {
            console.log("Event fetch error:", err);
            setError(err.message || "Failed to load event");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        loadEvent();
    }, [loadEvent]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadEvent();
    }, [loadEvent]);

    return {
        event,
        loading,
        refreshing,
        error,
        onRefresh,
        reload: loadEvent,
    };
};
