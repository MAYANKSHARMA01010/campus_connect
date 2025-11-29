import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_URL = "http://10.7.29.152:5001"; // adjust for your environment
const SERVER_URL = "https://campus-connect-backend-e7uf.onrender.com";

export const BASE_URL = __DEV__ ? LOCAL_URL : SERVER_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.log("api intercept request error:", err);
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
      } catch (_) {}
    }
    return Promise.reject(err);
  }
);

export default API;
