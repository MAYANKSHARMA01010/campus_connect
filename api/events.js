import API from "./api";

export const getAllEvents = async () => {
    try {
        const res = await API.get("/events/home");
        return res.data.events;
    } 
    catch (error) {
        console.log("ERROR FETCHING EVENTS:", error.response?.data || error);
        return [];
    }
};
  