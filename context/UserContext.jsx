import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import API from "../api/api";
import { loginUser, registerUser, logoutUser } from "../api/auth";
import { getMyProfile } from "../api/user";

const UserContext = createContext({
  user: null,
  token: null,
  loading: true,
  isLoggedIn: false,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  fetchUser: async () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync API header when token changes
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load stored token at startup
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await fetchUser(storedToken);
        }
      } catch (err) {
        console.log("UserProvider initialization error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch logged-in user profile
  const fetchUser = async (t = token) => {
    try {
      if (!t) return;
      const profile = await getMyProfile();
      setUser(profile.user ?? null);
    } catch (err) {
      console.log("fetchUser failed:", err?.response?.data || err);
      await logout();
    }
  };

  // Register
  const register = async (data) => {
    try {
      await registerUser(data);
      Alert.alert("Success", "Account created successfully!");
      return true;
    } catch (err) {
      console.log("register error:", err?.response?.data || err);
      Alert.alert("Error", err?.response?.data?.ERROR || "Registration failed");
      return false;
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const t = res.token;
      const u = res.user ?? null;

      await AsyncStorage.setItem("token", t);

      setToken(t);
      setUser(u);

      Alert.alert("Success", "Login successful!");
      return true;
    } catch (err) {
      console.log("login error:", err?.response?.data || err);
      Alert.alert("Error", err?.response?.data?.ERROR || "Invalid credentials");
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("logout error (ignored)", err?.response?.data || err);
    }

    await AsyncStorage.removeItem("token");

    setToken(null);
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!user,
        register,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
