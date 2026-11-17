import { axiosClient } from "./client";
import {
  clearTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./tokens";

export const login = async (email, password) => {
  const res = await axiosClient.post("/auth/login", { email, password });
  const { accessToken, refreshToken } = res.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  return accessToken;
};

export const register = async (email, username, password) => {
  const res = await axiosClient.post("/auth/register", {
    email,
    username,
    password,
  });
  return res.data;
};

export const refresh = async () => {
  const oldRefreshToken = getRefreshToken();
  const res = await axiosClient.post("/auth/refresh", {
    refreshToken: oldRefreshToken,
  });
  const { accessToken, refreshToken: newRefreshToken } = res.data;
  setAccessToken(accessToken);
  setRefreshToken(newRefreshToken);
  return accessToken;
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  try {
    await axiosClient.post("/auth/logout", { refreshToken });
  } finally {
    clearTokens();
  }
};
