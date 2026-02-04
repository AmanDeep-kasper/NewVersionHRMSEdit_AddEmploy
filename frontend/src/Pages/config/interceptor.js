import api from "./api";
import { refreshToken } from "./authApi";

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          await refreshToken(); // 🔥 refresh access token
          isRefreshing = false;
        }
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/login"; // 🔥 HARD REDIRECT
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
