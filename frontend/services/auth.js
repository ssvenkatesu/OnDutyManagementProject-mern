import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("https://ondutymanagementproject-mern-2.onrender.com/api/users/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";

};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  }
  return null;
};
