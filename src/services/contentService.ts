import api from "./api";

const normalizeMediaUrl = (url?: string) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;

  const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const contentService = {
  async getGallery() {
    const response = await api.get("/gallery");
    const gallery = response.data?.data ?? response.data ?? [];
    const normalizedGallery = Array.isArray(gallery)
      ? gallery.map((item) => ({ ...item, imageUrl: normalizeMediaUrl(item.imageUrl) }))
      : gallery;

    return { ...response.data, data: normalizedGallery };
  },

  async uploadGalleryImage(payload: FormData) {
    const response = await api.post("/gallery/upload", payload);
    return response.data;
  },

  async uploadProgressVideo(payload: FormData) {
    const response = await api.post("/progress-videos/upload", payload);
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
    const videos = response.data?.data ?? response.data ?? [];
    const normalizedVideos = Array.isArray(videos)
      ? videos.map((item) => ({ ...item, videoUrl: normalizeMediaUrl(item.videoUrl) }))
      : videos;

    return { ...response.data, data: normalizedVideos };
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
    const events = response.data?.data ?? response.data ?? [];
    const normalizedEvents = Array.isArray(events)
      ? events.map((item) => ({ ...item, imageUrl: normalizeMediaUrl(item.imageUrl) }))
      : events;

    return { ...response.data, data: normalizedEvents };
  },

  async uploadEventImage(payload: FormData) {
    const response = await api.post("/events/upload", payload);
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
