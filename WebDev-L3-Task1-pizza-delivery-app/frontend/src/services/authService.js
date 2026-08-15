import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

export const adminAuthService = {
  login: (data) => api.post("/admin/auth/login", data),
  getMe: () => api.get("/admin/auth/me"),
};
