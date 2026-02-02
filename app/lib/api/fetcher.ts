import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // If access token expired
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      const { data } = await api.post("/auth/refresh");
      api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

      return api(original);
    }

    return Promise.reject(err);
  }
);

export default api;
