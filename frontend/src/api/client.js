import axios from "axios";
import { clearTokens, getAccessToken, getRefreshToken } from "./tokens";
import { refresh } from "./auth";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshPromise = null;

export const refreshOnce = () => {
  if (!refreshPromise) {
    refreshPromise = refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url.startsWith("/auth/") ||
      !getRefreshToken()
    ) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      const newToken = await refreshOnce();
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(original);
    } catch {
      clearTokens();
      return Promise.reject(error);
    }
  },
);