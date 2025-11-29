import API from "./api";

export const registerUser = async (payload) => {
  const res = await API.post("/user/register", payload);
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await API.post("/user/login", payload);
  return res.data;
};

export const logoutUser = async () => {
  const res = await API.post("/user/logout");
  return res.data;
};
