import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      toast.error("Network error. Please try again.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    /* ================== 401 → TOKEN HANDLING ================== */
    if (
      status === 401 &&
      data?.message === "ACCESS_TOKEN_EXPIRED" &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch {
        window.location.replace("/");
        return Promise.reject(error);
      }
    }

    if (
      status === 401 &&
      ["TOKEN_INVALID", "Session expired", "No token"].includes(data?.message)
    ) {
      window.location.replace("/");
      return Promise.reject(error);
    }

    /* ================== 403 → PERMISSION HANDLING ================== */
    if (status === 403) {
      toast.error("You are not authorized to perform this action");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
