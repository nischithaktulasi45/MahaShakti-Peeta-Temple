import axios from "axios";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (
    envUrl &&
    typeof envUrl === "string" &&
    envUrl.trim() !== "" &&
    !envUrl.includes("2ssjo1qq0")
  ) {
    return envUrl.trim().replace(/\/$/, "");
  }
  return import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin-token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default api;
