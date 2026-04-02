import { useState, useCallback, useEffect, useRef } from "react";
import { eventAPI } from "../api/api";

export const useEvents = (limit = 10) => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const activeListControllerRef = useRef(null);
    const isFetchingRef = useRef(false);

    const fetchEvents = useCallback(
        async ({ page = 1, category = "all", sort = "recent", past = false, reset = false } = {}) => {
            if (isFetchingRef.current) {
                return;
            }

            isFetchingRef.current = true;

            try {
                if (reset) {
                    setLoading(true);
                    setError(null);
                    setHasMore(true);
                }
                
                const isFirstPage = page === 1;

                if (reset && activeListControllerRef.current) {
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
                const responseHasMore =
                    typeof res?.hasMore === "boolean" ? res.hasMore : eventData.length >= limit;

                if (reset || isFirstPage) {
                    setEvents(eventData);
                } else {
                    setEvents((prev) => [...prev, ...eventData]);
                }

                setHasMore(responseHasMore);

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
                isFetchingRef.current = false;
            }
        },
        [limit]
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
        hasMore,
        loading,
        refreshing,
        loadingMore,
        error,
        fetchEvents,
        setRefreshing,
        setLoadingMore,
    };
};
