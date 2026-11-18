import { axiosClient } from "./client";

export const getGames = async (params) => {
  const res = await axiosClient.get("/games", { params });
  return res.data;
};

export const getGame = async (id) => {
  const res = await axiosClient.get(`/games/${id}`);
  return res.data;
};

export const createGame = async (data) => {
  const res = await axiosClient.post("/games", data);
  return res.data;
};

export const updateGame = async (id, data) => {
  const res = await axiosClient.put(`/games/${id}`, data);
  return res.data;
};

export const deleteGame = async (id) => {
  await axiosClient.delete(`/games/${id}`);
};
