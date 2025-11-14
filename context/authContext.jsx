import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";
import { Alert } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) await fetchUser();
      setLoading(false);
    })();
  }, []);

  const register = async (data) => {
    try {
      const res = await API.post("/register", data);
      Alert.alert("Success", "Account created successfully!");
      return res.data;
    } 
    catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Registration failed");
    }
  };

  const login = async (credentials) => {
    try {
      const res = await API.post("/login", credentials);
      const token = res.data.token;
      await AsyncStorage.setItem("token", token);
      setUser(res.data.user);
      Alert.alert("Success", "Login successful!");
      return true;
    } 
    catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Invalid credentials");
      return false;
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data.user);
    } 
    catch (err) {
      console.error("Fetch user failed", err.response?.data);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await API.put("/update", updates);
      setUser(res.data.user);
      Alert.alert("Success", "Profile updated successfully!");
    } 
    catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Update failed");
    }
  };

  const logout = async () => {
    try {
      await API.post("/logout");
    } 
    catch (err) {
      console.error("Logout failed", err.response?.data);
    }
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, isLoggedIn, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
