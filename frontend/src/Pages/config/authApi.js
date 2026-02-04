import api from "./api";

export const getMe = () => api.get("/me");
export const refreshToken = () => api.post("/refresh-token");
export const logout = () => api.post("/logout");
