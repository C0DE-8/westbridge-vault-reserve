// /src/api/axios.js
import axios from "axios";

// export const API_BASE_URL = "https://api.west.74globalgain.pw/api";
// export const API_ORIGIN = "https://api.west.74globalgain.pw";

export const API_BASE_URL = "https://api.stercxabank.veliport24.com/api";
export const API_ORIGIN = "https://api.stercxabank.veliport24.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || "";
  const token = url.startsWith("/admin")
    ? localStorage.getItem("adminToken")
    : url.startsWith("/user")
      ? localStorage.getItem("userToken")
      : localStorage.getItem("userToken") || localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
