import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the user id from localStorage as x-user-id header automatically
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("questly_user_id");
  if (userId) {
    config.headers["x-user-id"] = userId;
  }
  return config;
});

export default api;