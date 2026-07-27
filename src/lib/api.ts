import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT token from localStorage as Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("questly_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;