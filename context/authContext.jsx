import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import API from "../api/api";

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
      const res = await API.post("/auth/register", data);
      Alert.alert("Success", "Account created successfully!");
      return res.data;
    } catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Registration failed");
      return null;
    }
  };

  const login = async (credentials) => {
    try {
      const res = await API.post("/auth/login", credentials);
      const token = res.data.token;
      await AsyncStorage.setItem("token", token);
      setUser(res.data.user);
      Alert.alert("Success", "Login successful!");
      return true;
    } catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Invalid credentials");
      return false;
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      await AsyncStorage.removeItem("token");
      setUser(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await API.put("/auth/update", updates);
      setUser(res.data.user);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Update failed");
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        register,
        login,
        logout,
        updateProfile,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
