import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL_DEV, API_URL_PROD, API_URL_LOCAL } from "@env";

const LOCAL_URL = API_URL_DEV;
const LOCAL_URL2 = API_URL_LOCAL;
const SERVER_URL = API_URL_PROD;

export const BASE_URL = __DEV__ ? LOCAL_URL : LOCAL_URL2 ? LOCAL_URL2 : SERVER_URL;

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

  getAll: async () => {
    try {
      const res = await API.get("/events/home");
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
