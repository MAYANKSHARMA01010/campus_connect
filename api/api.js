import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL="https://campus-connect-backend-e7uf.onrender.com"; 

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
