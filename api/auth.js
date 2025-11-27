// /api/auth.js
import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Register user
export const registerUser = async (payload) => {
  const res = await API.post("/auth/register", payload);
  return res.data;
};

// Login user
export const loginUser = async (payload) => {
  const res = await API.post("/auth/login", payload);
  return res.data;
};

// Logout (remove token locally)
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
};
