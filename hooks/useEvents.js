import { useState, useCallback, useEffect } from "react";
import { eventAPI } from "../api/api";

export const useEvents = (limit = 10) => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(
        async ({ page = 1, category = "all", sort = "recent", past = false, reset = false } = {}) => {
            try {
                if (reset) {
                    setLoading(true);
                    setError(null);
                }

                // If we are fetching page 1, it's a reset or initial load
                const isFirstPage = page === 1;

                const res = await eventAPI.getList({
                    page,
                    limit,
                    category,
                    sort,
                    past,
                });

                // Wait, I need to make sure I'm calling the right endpoint.
                // The previous code in Events.jsx was: `const res = await API.get("/events", ...)`
                // My new api.js has `getAll` -> `/events/home`.
                // I need to add `getList` -> `/events` to api.js.
                // I will do that in a fix step. For now I will write the hook assuming `eventAPI.getList` exists.

                const eventData = res?.events || [];
                const categoryData = res?.categories || [];

                if (reset || isFirstPage) {
                    setEvents(eventData);
                } else {
                    setEvents((prev) => [...prev, ...eventData]);
                }

                if (categoryData.length) {
                    setCategories(["all", ...categoryData]);
                }

                setTotalEvents(res?.total || 0);
            } catch (e) {
                console.log("Fetch Error:", e);
                setError(e.message || "Failed to fetch events");
            } finally {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
            }
        },
        [limit]
    );

    return {
        events,
        categories,
        totalEvents,
        loading,
        refreshing,
        loadingMore,
        error,
        fetchEvents,
        setRefreshing,
        setLoadingMore,
    };
};
