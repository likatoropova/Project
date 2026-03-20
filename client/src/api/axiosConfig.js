import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Authenticated requests must never carry a guest ID —
      // the backend would treat it as a transfer trigger.
      delete config.headers["X-Guest-ID"];
    } else {
      const rawGuestId = localStorage.getItem("guestId");
      if (rawGuestId) {
        try {
          config.headers["X-Guest-ID"] = JSON.parse(rawGuestId);
        } catch {
          config.headers["X-Guest-ID"] = rawGuestId;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
