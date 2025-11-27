import API from "./api";

export const getMyProfile = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await API.put("/users/me", payload);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};
