import { axiosClient } from "./client";

export const getRounds = async (gameId) => {
  const res = await axiosClient.get(`/games/${gameId}/rounds`);
  return res.data;
};

export const getRound = async (gameId, roundId) => {
  const res = await axiosClient.get(`/games/${gameId}/rounds/${roundId}`);
  return res.data;
};

export const createRound = async (gameId) => {
  const res = await axiosClient.post(`/games/${gameId}/rounds`);
  return res.data;
};

export const updateRound = async (gameId, roundId, data) => {
  const res = await axiosClient.put(`/games/${gameId}/rounds/${roundId}`, data);
  return res.data;
};

export const deleteRound = async (gameId, roundId) => {
  await axiosClient.delete(`/games/${gameId}/rounds/${roundId}`);
};
