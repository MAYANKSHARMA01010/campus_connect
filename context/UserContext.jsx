import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import API from "../api/api";
import { loginUser, registerUser, logoutUser } from "../api/auth";
import { getMyProfile, updateMyProfile } from "../api/user";

const UserContext = createContext({
  user: null,
  role: null,
  token: null,
  loading: true,
  isLoggedIn: false,
  isAdmin: false,
  isUser: false,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  fetchUser: async () => {},
  updateProfile: async () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
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
        const storedRole = await AsyncStorage.getItem("role");

        if (storedToken) setToken(storedToken);
        if (storedRole) setRole(storedRole);

        if (storedToken) {
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
      const u = profile.user ?? profile;

      setUser(u);
      setRole(u?.role || "USER");

      await AsyncStorage.setItem("role", u?.role || "USER");
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
      Alert.alert("Error", err?.response?.data?.ERROR || "Registration failed");
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const t = res.token;
      const u = res.user;

      if (!t) {
        Alert.alert("Error", "Server did not return token");
        return false;
      }

      await AsyncStorage.multiSet([
        ["token", t],
        ["role", u?.role || "USER"],
      ]);

      setToken(t);
      setUser(u);
      setRole(u?.role || "USER");

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
      const res = await updateMyProfile(payload);
      const updated = res.user ?? res;

      if (!updated) {
        await fetchUser();
      } else {
        setUser((prev) => ({ ...(prev ?? {}), ...updated }));
        setRole(updated?.role || role);

        await AsyncStorage.setItem("role", updated?.role || role);
      }

      Alert.alert("Success", "Profile updated.");
      return { ok: true, user: updated ?? null };
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.ERROR || "Unable to update profile"
      );

      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (_) {}

    try {
      await AsyncStorage.multiRemove(["token", "role"]);
    } catch (_) {}

    setUser(null);
    setToken(null);
    setRole(null);

    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isLoggedIn: !!user,
        isAdmin: role === "ADMIN",
        isUser: role === "USER",
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
