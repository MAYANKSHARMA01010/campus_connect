import API from "./api";
import { Platform } from "react-native";

export const createEventWithImages = async (payload, images) => {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    form.append(key, value);
  });

  images.forEach((uri, index) => {
    const ext = uri.split(".").pop();
    const name = `image_${Date.now()}_${index}.${ext}`;

    form.append("images", {
      uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
  });

  const res = await API.post("/events/request", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const getAllEvents = async () => {
  try {
    const res = await API.get("/events/home");
    return res.data.events;
  } catch (error) {
    console.log("ERROR FETCHING EVENTS:", error);
    return [];
  }
};

export const getEventById = async (id) => {
  try {
    const res = await API.get(`/events/${id}`);
    return res.data;
  } catch (error) {
    console.log("ERROR FETCHING EVENT:", error.response?.data || error.message);
    return null;
  }
};

export const searchEvents = async (query) => {
  try {
    const res = await API.get(`/events/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (err) {
    console.error("SEARCH API ERROR:", err.response?.data || err.message);
    throw err;
  }
};
