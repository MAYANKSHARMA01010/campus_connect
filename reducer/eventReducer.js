import API from "../api/api";

export const initialState = {
    events: [],
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

        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                refreshing: false,
                loadingMore: false,

                events: action.reset
                    ? action.payload.events
                    : [...state.events, ...action.payload.events],

                total: action.payload.total,
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

        const res = await API.get("/events/admin", {
            params: {
                search: search || undefined,

                status:
                    statusFilter && statusFilter !== "all" ? statusFilter : undefined,

                sortBy: sort || "recent",

                pageNumber: page,
                pageSize: limit,
            },
        });

        dispatch({
            type: "FETCH_SUCCESS",
            reset,
            payload: {
                events: res?.data?.events ?? [],
                total: res?.data?.total ?? 0,
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

        await API.patch(`/events/admin/${id}/status`, {
            status,
        });

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

        await API.delete(`/events/admin/${id}`);

        await reload();
    } catch (err) {
        console.log("DELETE ERROR:", err?.response?.data || err.message);
    } finally {
        dispatch({ type: "ACTION_END" });
    }
};
