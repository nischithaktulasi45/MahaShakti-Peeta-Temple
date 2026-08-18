import api from "./api";

export const submitDonation = (payload: Record<string, unknown>) => api.post("/donations", payload);
