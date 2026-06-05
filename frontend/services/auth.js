import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/api/users/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/api/users/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }
  return null;
};
