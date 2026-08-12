import api from "./api";

export const adminService = {
  async login(email: string, password: string) {
    const response = await api.post("/admin/login", { email, password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/admin/me");
    return response.data;
  },

  async logout() {
    const response = await api.post("/admin/logout");
    return response.data;
  },
};
