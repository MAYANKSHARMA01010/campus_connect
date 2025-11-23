import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const BASE_URL = "https://campus-connect-backend-e7uf.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default API;

export const getEvent = async (id) => {
  const res = await API.get(`/events/${id}`);
  return res.data;
};

export const rsvpEvent = async (id, status = "going") => {
  const res = await API.post(`/events/${id}/rsvp`, { status });
  return res.data;
};

export const createEventWithImages = async (payload, images) => {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => form.append(k, v));
  images.forEach((uri, idx) => {
    const ext = uri.split(".").pop();
    const name = `image_${Date.now()}_${idx}.${ext}`;
    form.append("images", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
  });

  const res = await API.post("/events", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
