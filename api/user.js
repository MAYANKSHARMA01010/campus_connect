import API from "./api";

export const getMyProfile = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const res = await API.get("/user/me", config);
  return res.data;
};

export const updateMyProfile = async (payload) => {
  const res = await API.put("/user/update", payload);
  return res.data;
};
