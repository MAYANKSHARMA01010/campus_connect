import { eventAPI } from "../api/api";

export const initialState = {
    events: [],
    filteredEvents: [],
    filter: "ALL",
    total: 0,

    loading: false,
    refreshing: false,
    loadingMore: false,

    actionLoading: null,
};

export const eventReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_START":
            return {
                ...state,
                loading: action.reset === true,
                refreshing: action.reset === false,
                loadingMore: false,
            };

        case "FETCH_MORE":
            return {
                ...state,
                loadingMore: true,
            };

        case "FETCH_SUCCESS": {
            const allEvents = action.reset
                ? action.payload.events
                : [...state.events, ...action.payload.events];

            return {
                ...state,
                loading: false,
                refreshing: false,
                loadingMore: false,

                events: allEvents,
                filteredEvents: applyFilter(allEvents, state.filter),
                total: action.payload.total,
            };
        }

        case "SET_FILTER":
            return {
                ...state,
                filter: action.payload,
                filteredEvents: applyFilter(state.events, action.payload),
            };

        case "ACTION_START":
            return {
                ...state,
                actionLoading: action.payload,
            };

        case "ACTION_END":
            return {
                ...state,
                actionLoading: null,
            };

        default:
            return state;
    }
};

const applyFilter = (events, filter) => {
    if (!filter || filter === "ALL" || filter === "all") return events;
    return events.filter((e) => e.status === filter);
};

export const fetchAdminEvents = async ({
    dispatch,
    search,
    statusFilter,
    sort,
    page,
    limit,
    reset = false,
}) => {
    try {
        dispatch({
            type: reset ? "FETCH_START" : "FETCH_MORE",
            reset,
        });

        const res = await eventAPI.getAdminEvents({
            search: search || undefined,
            status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
            sortBy: sort || "recent",
            pageNumber: page,
            pageSize: limit,
        });

        dispatch({
            type: "FETCH_SUCCESS",
            reset,
            payload: {
                events: res?.events ?? [],
                total: res?.total ?? 0,
            },
        });
    } catch (err) {
        console.log("FETCH ERROR:", err?.response?.data || err.message);
        dispatch({ type: "ACTION_END" });
    }
};

export const updateEventStatus = async (dispatch, id, status, reload) => {
    try {
        dispatch({
            type: "ACTION_START",
            payload: id,
        });

        await eventAPI.updateStatus(id, status);

        await reload();
    } catch (err) {
        console.log("UPDATE ERROR:", err?.response?.data || err.message);
    } finally {
        dispatch({ type: "ACTION_END" });
    }
};

export const deleteEvent = async (dispatch, id, reload) => {
    try {
        dispatch({
            type: "ACTION_START",
            payload: id,
        });

        await eventAPI.deleteAdmin(id);

        await reload();
    } catch (err) {
        console.log("DELETE ERROR:", err?.response?.data || err.message);
    } finally {
        dispatch({ type: "ACTION_END" });
    }
};
