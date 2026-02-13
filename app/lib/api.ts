import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const { token, hotelId } = useAuthStore.getState();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (hotelId && config.url && !config.url.includes("/api/hotel/admin/hotels")) {
    config.headers["X-Hotel-ID"] = hotelId;
  }

  return config;
});

// api.interceptors.request.use((config) => {
//   const { token, hotelId } = useAuthStore.getState();

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   if (hotelId) {
//     config.headers["X-Hotel-ID"] = hotelId;
//   }

//   return config;
// });

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
