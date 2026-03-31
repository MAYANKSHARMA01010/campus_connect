import { useState, useCallback, useEffect, useRef } from "react";
import { eventAPI } from "../api/api";

export const useEvents = (limit = 10) => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const activeListControllerRef = useRef(null);

    const fetchEvents = useCallback(
        async ({ page = 1, category = "all", sort = "recent", past = false, reset = false } = {}) => {
            try {
                if (reset) {
                    if (events.length === 0) {
                        setLoading(true);
                    }
                    setError(null);
                }
                
                const isFirstPage = page === 1;

                if (activeListControllerRef.current) {
                    activeListControllerRef.current.abort();
                }

                const controller = new AbortController();
                activeListControllerRef.current = controller;

                const res = await eventAPI.getList({
                    page,
                    limit,
                    category,
                    sort,
                    past,
                }, {
                    signal: controller.signal,
                });

                const eventData = res?.events || [];
                const categoryData = res?.categories || [];

                if (reset || isFirstPage) {
                    setEvents(eventData);
                } else {
                    setEvents((prev) => [...prev, ...eventData]);
                }

                if (categoryData.length) {
                    const filteredCategories = categoryData.filter(
                        (value) => {
                            const category = String(value).toLowerCase();
                            return (
                                category !== "other" &&
                                category !== "gaming" &&
                                category !== "seminar"
                            );
                        }
                    );
                    setCategories(["all", ...filteredCategories]);
                }

                setTotalEvents(res?.total || 0);
            } catch (e) {
                if (e?.code === "ERR_CANCELED") return;
                console.log("Fetch Error:", e);
                setError(e.message || "Failed to fetch events");
            } finally {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
            }
        },
        [limit, events.length]
    );

    useEffect(() => {
        return () => {
            if (activeListControllerRef.current) {
                activeListControllerRef.current.abort();
            }
        };
    }, []);

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
