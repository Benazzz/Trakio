let accessToken = null;

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};

export const clearTokens = () => {
  accessToken = null;
  localStorage.removeItem("refreshToken");
};
