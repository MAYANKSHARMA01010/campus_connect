import API from "./api";

/* ================================
   CREATE EVENT WITH IMAGES
================================ */
export const createEventWithImages = async (payload, images) => {
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
};

/* ================================
   HOME EVENTS
================================ */
export const getAllEvents = async () => {
  try {
    const res = await API.get("/events/home");
    return res.data.events;
  } catch (err) {
    console.log("ERROR FETCHING EVENTS:", err.response?.data || err.message);
    return [];
  }
};

/* ================================
   SINGLE EVENT
================================ */
export const getEventById = async (id) => {
  try {
    const res = await API.get(`/events/${id}`);
    return res.data;
  } catch (err) {
    console.log("ERROR FETCHING EVENT:", err.response?.data || err.message);
    return null;
  }
};

/* ================================
   SEARCH EVENTS
================================ */
export const searchEvents = async (query) => {
  try {
    const res = await API.get(`/events/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (err) {
    console.log("SEARCH API ERROR:", err.response?.data || err.message);
    return [];
  }
};

/* ================================
   USER => MY EVENTS
================================ */
export const getMyEvents = async () => {
  try {
    const res = await API.get("/events/me");
    return res.data.data;
  } catch (err) {
    console.log("MY EVENTS ERROR:", err.response?.data || err.message);
    return [];
  }
};

/* ================================
   USER => DELETE EVENT
================================ */
export const deleteMyEvent = async (id) => { 
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
};
