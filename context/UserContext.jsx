import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import API from "../api/api";

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

  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

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

  const fetchUser = async (t = token) => {
    try {
      if (!t) return;
      const res = await API.get("/user/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUser(res.data.user ?? null);
    } catch (err) {
      console.log("fetchUser failed:", err?.response?.status, err?.response?.data);
      await logout();
    }
  };

  const register = async (data) => {
    try {
      await API.post("/user/register", data);
      Alert.alert("Success", "Account created successfully!");
      return true;
    } catch (err) {
      console.log("register error:", err?.response?.data || err);
      Alert.alert("Error", err.response?.data?.ERROR || "Registration failed");
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const res = await API.post("/user/login", credentials);
      const t = res.data.token;
      const u = res.data.user ?? null;

      setToken(t);
      API.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      await AsyncStorage.setItem("token", t);
      setUser(u);

      Alert.alert("Success", "Login successful!");
      return true;
    } catch (err) {
      console.log("login error:", err?.response?.data || err);
      Alert.alert("Error", err.response?.data?.ERROR || "Invalid credentials");
      return false;
    }
  };

  const logout = async () => {
    try {
      await API.post("/user/logout");
    } catch (err) {
      console.log("logout server call failed (ignored):", err?.response?.data || err);
    }

    try {
      await AsyncStorage.removeItem("token");
    } catch (e) {
      console.log("AsyncStorage removeItem failed:", e);
    }

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
