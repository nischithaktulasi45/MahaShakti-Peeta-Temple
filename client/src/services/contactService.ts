import api from "./api";

export const submitContactMessage = (payload: Record<string, unknown>) => api.post("/contact", payload);
