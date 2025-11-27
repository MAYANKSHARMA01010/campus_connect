// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import API from "../api/api";
import { loginUser, registerUser, logoutUser } from "../api/auth";
import { getMyProfile, updateMyProfile } from "../api/user";

const UserContext = createContext({
  user: null,
  token: null,
  loading: true,
  isLoggedIn: false,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  fetchUser: async () => {},
  updateProfile: async () => {},
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
        console.log("UserProvider init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchUser = async (t = token) => {
    try {
      if (!t) return;
      const profile = await getMyProfile(t);
      // server may return { user: {...} } or plain {...}
      const u = profile.user ?? profile;
      setUser(u ?? null);
    } catch (err) {
      console.log("fetchUser failed:", err?.response?.data || err);
      await logout();
    }
  };

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

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      const t = res.token;
      const u = res.user ?? null;

      if (!t) {
        Alert.alert("Error", "Server did not return a token.");
        return false;
      }

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

  const updateProfile = async (payload) => {
    try {
      // payload should be an object with fields you allow to change on server
      const res = await updateMyProfile(payload);
      // backend might return { user: {...} } or the updated user object directly
      const updated = res.user ?? res;
      if (!updated) {
        // if server returned something else, re-fetch canonical user
        await fetchUser();
      } else {
        setUser((prev) => ({ ...(prev ?? {}), ...(updated ?? {}) }));
      }
      Alert.alert("Success", "Profile updated.");
      return { ok: true, user: updated ?? null };
    } catch (err) {
      console.log("updateProfile error:", err?.response?.data || err);
      Alert.alert(
        "Error",
        err?.response?.data?.ERROR || "Unable to update profile. Try again."
      );
      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("logout error (server) ignored:", err?.response?.data || err);
    }

    try {
      await AsyncStorage.removeItem("token");
    } catch (err) {
      console.log("AsyncStorage removeItem error:", err);
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
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
