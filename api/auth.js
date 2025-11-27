import API from "./api";

/**
 * Calls server register endpoint.
 * Returns res.data (server response).
 */
export const registerUser = async (payload) => {
  const res = await API.post("/user/register", payload);
  return res.data;
};

/**
 * Calls server login endpoint.
 * Returns res.data (should include token and user).
 * Do NOT write token to AsyncStorage here — let the context manage storage.
 */
export const loginUser = async (payload) => {
  const res = await API.post("/user/login", payload);
  return res.data;
};

/**
 * Call server logout endpoint. Do not remove local token here;
 * let your context handle local storage & header cleanup.
 */
export const logoutUser = async () => {
  const res = await API.post("/user/logout");
  return res.data;
};
