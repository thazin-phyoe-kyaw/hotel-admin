import axios from "axios";
import { getCookie } from "cookies-next/server";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = getCookie("token"); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
