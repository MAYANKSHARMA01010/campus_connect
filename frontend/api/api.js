import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL_DEV, API_URL_PROD, API_URL_LOCAL } from "@env";

const normalizeBaseUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/+$/, "");
};

const unique = (arr) => [...new Set(arr.filter(Boolean))];

const DEV_URL = normalizeBaseUrl(API_URL_DEV);
const PROD_URL = normalizeBaseUrl(API_URL_PROD);
const LOCAL_URL = normalizeBaseUrl(API_URL_LOCAL);

const CANDIDATE_BASE_URLS = __DEV__
  ? unique([DEV_URL, LOCAL_URL, PROD_URL])
  : unique([PROD_URL, DEV_URL, LOCAL_URL]);

let activeBaseUrlIndex = 0;
export let BASE_URL = CANDIDATE_BASE_URLS[activeBaseUrlIndex] || "http://localhost:5001";

const setActiveBaseUrl = (index) => {
  activeBaseUrlIndex = index;
  BASE_URL = CANDIDATE_BASE_URLS[index];
  API.defaults.baseURL = `${BASE_URL}/api`;
};

const getNextBaseUrlIndex = (triedIndexes = []) => {
  for (let i = 0; i < CANDIDATE_BASE_URLS.length; i += 1) {
    if (!triedIndexes.includes(i)) return i;
  }
  return -1;
};

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("API request interceptor error:", err);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err?.config || {};

    const shouldRetryWithFallback =
      !originalConfig.__baseUrlFallbackAttempt &&
      (err?.code === "ECONNABORTED" || !err?.response || err?.response?.status >= 500);

    if (shouldRetryWithFallback && CANDIDATE_BASE_URLS.length > 1) {
      const tried = originalConfig.__triedBaseUrlIndexes || [activeBaseUrlIndex];
      const nextBaseUrlIndex = getNextBaseUrlIndex(tried);

      if (nextBaseUrlIndex !== -1) {
        const retryConfig = {
          ...originalConfig,
          baseURL: `${CANDIDATE_BASE_URLS[nextBaseUrlIndex]}/api`,
          __baseUrlFallbackAttempt: true,
          __triedBaseUrlIndexes: [...tried, nextBaseUrlIndex],
        };

        try {
          const retryResponse = await API.request(retryConfig);
          setActiveBaseUrl(nextBaseUrlIndex);
          return retryResponse;
        } catch (retryErr) {
          err = retryErr;
        }
      }
    }

    if (err?.response?.status === 401) {
      try {
        await AsyncStorage.removeItem("token");
      } catch (_) { }
    }
    return Promise.reject(err);
  }
);

export default API;

export const authAPI = {
  register: async (payload) => {
    const res = await API.post("/user/register", payload);
    return res.data;
  },
  login: async (payload) => {
    const res = await API.post("/user/login", payload);
    return res.data;
  },
  logout: async () => {
    const res = await API.post("/user/logout");
    return res.data;
  },
};

export const userAPI = {
  getProfile: async (token) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    const res = await API.get("/user/me", config);
    return res.data;
  },
  updateProfile: async (payload) => {
    const res = await API.put("/user/update", payload);
    return res.data;
  },
};

export const eventAPI = {
  submitRequest: async (payload) => {
    const res = await API.post("/events/request", payload);
    return res.data;
  },

  create: async (payload, images) => {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      form.append(key, value);
    });

    images.forEach((uri, index) => {
      const ext = uri.split(".").pop();
      const name = `image_${Date.now()}_${index}.${ext}`;

      form.append("images", {
        uri,
        name,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      });
    });

    const res = await API.post("/events/request", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  getAll: async (params = { limit: 60 }) => {
    try {
      const res = await API.get("/events/home", { params });
      return res.data.events;
    } catch (err) {
      console.log("ERROR FETCHING EVENTS:", err.response?.data || err.message);
      return [];
    }
  },

  getList: async (params) => {
    const res = await API.get("/events", { params });
    return res.data;
  },

  getById: async (id) => {
    try {
      const res = await API.get(`/events/${id}`);
      return res.data;
    } catch (err) {
      console.log("ERROR FETCHING EVENT:", err.response?.data || err.message);
      return null;
    }
  },

  search: async (query) => {
    try {
      const res = await API.get(`/events/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err) {
      console.log("SEARCH API ERROR:", err.response?.data || err.message);
      return [];
    }
  },
  getMy: async () => {
    try {
      const res = await API.get("/events/me");
      return res.data.data;
    } catch (err) {
      console.log("MY EVENTS ERROR:", err.response?.data || err.message);
      return [];
    }
  },

  deleteMy: async (id) => {
    try {
      const safeId = Number(id);

      if (!safeId || Number.isNaN(safeId)) {
        throw new Error("Invalid event id");
      }

      await API.delete(`/events/me/${safeId}`);
    } catch (err) {
      console.log("DELETE EVENT ERROR:", err.response?.data || err.message);
      throw err;
    }
  },

  getAdminEvents: async (params) => {
    const res = await API.get("/events/admin", { params });
    return res.data;
  },

  updateStatus: async (id, status) => {
    await API.patch(`/events/admin/${id}/status`, { status });
  },
  
  deleteAdmin: async (id) => {
    await API.delete(`/events/admin/${id}`);
  }
};
