import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import API from "../api/api";
import { loginUser, registerUser, logoutUser } from "../api/auth";
import { getMyProfile, updateMyProfile } from "../api/user";

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const UserContext = createContext({
  user: null,
  role: null,
  token: null,
  loading: true,

  isLoggedIn: false,
  isAdmin: false,
  isUser: false,

  register: async () => false,
  login: async () => false,
  logout: async () => { },
  fetchUser: async () => { },
  updateProfile: async () => { },
});

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------------- Set Axios Auth Header -------------------------- */
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* ----------------------------- App Boot Logic ------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedRole] = await AsyncStorage.multiGet([
          "token",
          "role",
        ]);

        const t = storedToken?.[1];
        const r = storedRole?.[1];

        if (t) setToken(t);
        if (r) setRole(r);

        if (t) {
          await fetchUser(t);
        }
      } catch (err) {
        console.log("UserProvider init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               AUTH METHODS                                 */
  /* -------------------------------------------------------------------------- */

  const fetchUser = useCallback(
    async (t = token) => {
      try {
        if (!t) return;

        const profile = await getMyProfile(t);
        const u = profile?.user ?? profile;

        setUser(u);
        setRole(u?.role || "USER");

        await AsyncStorage.setItem("role", u?.role || "USER");
      } catch (err) {
        console.log("fetchUser failed:", err?.response?.data || err);
        await logout();
      }
    },
    [token]
  );

  const register = async (data) => {
    try {
      await registerUser(data);

      Alert.alert("Success", "Account created successfully!");
      return true;
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.ERROR || err?.message || "Registration failed"
      );

      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const t = res?.token;
      const u = res?.user;

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

      Alert.alert(
        "Error",
        err?.response?.data?.ERROR || err?.message || "Invalid credentials"
      );

      return false;
    }
  };

  const updateProfile = async (payload) => {
    try {
      const res = await updateMyProfile(payload);

      const updated = res?.user ?? res;

      if (!updated) {
        await fetchUser();
      } else {
        setUser((prev) => ({ ...(prev ?? {}), ...updated }));
        setRole(updated?.role || role);

        await AsyncStorage.setItem("role", updated?.role || role || "USER");
      }

      Alert.alert("Success", "Profile updated.");
      return { ok: true, user: updated ?? null };
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.ERROR || err?.message || "Unable to update profile"
      );

      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (_) { }

    try {
      await AsyncStorage.multiRemove(["token", "role"]);
    } catch (_) { }

    delete API.defaults.headers.common["Authorization"];

    setUser(null);
    setToken(null);
    setRole(null);
  };

  /* -------------------------------------------------------------------------- */
  /*                               PROVIDER VALUE                               */
  /* -------------------------------------------------------------------------- */

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
