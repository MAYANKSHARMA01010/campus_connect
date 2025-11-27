// /api/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_URL = "http://10.7.29.152:5001";
const SERVER_URL = "https://campus-connect-backend-e7uf.onrender.com";

export const BASE_URL = __DEV__ ? LOCAL_URL : SERVER_URL;

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
