import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
      setLoading(false);
    })();
  }, []);

  const fetchUser = async (t = token) => {
    try {
      const res = await API.get("/user/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUser(res.data.user);
    } catch {
      await logout();
    }
  };

  // FIXED: return true/false
  const register = async (data) => {
    try {
      await API.post("/user/register", data);
      Alert.alert("Success", "Account created successfully!");
      return true;
    } catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Registration failed");
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const res = await API.post("/user/login", credentials);
      const t = res.data.token;
      const u = res.data.user;

      setToken(t);
      await AsyncStorage.setItem("token", t);
      setUser(u);

      Alert.alert("Success", "Login successful!");
      return true;
    } catch (err) {
      Alert.alert("Error", err.response?.data?.ERROR || "Invalid credentials");
      return false;
    }
  };

  const logout = async () => {
    try {
      await API.post("/user/logout");
    } catch {}

    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
