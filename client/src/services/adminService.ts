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

  async resendVerification(email: string) {
    const response = await api.post("/admin/resend-verification", { email });
    return response.data;
  },

  async getContactMessages() {
    const response = await api.get("/admin/contacts");
    return response.data;
  },

  async deleteContactMessage(id: string) {
  const response = await api.delete(`/admin/contacts/${id}`);
  return response.data;
},

  async getDonationRecords() {
    const response = await api.get("/admin/donations");
    return response.data;
  },
};