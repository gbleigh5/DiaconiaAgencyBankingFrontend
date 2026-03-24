import axios from "axios";
import { tokenStorage } from "@/lib/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      const refresh = tokenStorage.getRefreshToken();
      if (refresh) {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, { refresh });
        tokenStorage.setTokens(data.access, data.refresh ?? refresh);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
