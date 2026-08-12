import api from "./api";

export const contentService = {
  async getGallery() {
    const response = await api.get("/gallery");
    return response.data;
  },

  async createGallery(payload: Record<string, unknown>) {
    const response = await api.post("/gallery", payload);
    return response.data;
  },

  async deleteGallery(id: string) {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },

  async getVideos() {
    const response = await api.get("/progress-videos");
    return response.data;
  },

  async createVideo(payload: Record<string, unknown>) {
    const response = await api.post("/progress-videos", payload);
    return response.data;
  },

  async deleteVideo(id: string) {
    const response = await api.delete(`/progress-videos/${id}`);
    return response.data;
  },

  async getEvents() {
    const response = await api.get("/events");
    return response.data;
  },

  async createEvent(payload: Record<string, unknown>) {
    const response = await api.post("/events", payload);
    return response.data;
  },

  async updateEvent(id: string, payload: Record<string, unknown>) {
    const response = await api.put(`/events/${id}`, payload);
    return response.data;
  },

  async deleteEvent(id: string) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};
