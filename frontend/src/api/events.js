import { axiosClient } from "./client";

const eventsUrl = (gameId, roundId) =>
  `/games/${gameId}/rounds/${roundId}/events`;

export const getEvents = async (gameId, roundId) => {
  const res = await axiosClient.get(eventsUrl(gameId, roundId));
  return res.data;
};

export const createEvent = async (gameId, roundId, data) => {
  const res = await axiosClient.post(eventsUrl(gameId, roundId), data);
  return res.data;
};

export const updateEvent = async (gameId, roundId, eventId, data) => {
  const res = await axiosClient.put(
    `${eventsUrl(gameId, roundId)}/${eventId}`,
    data,
  );
  return res.data;
};

export const deleteEvent = async (gameId, roundId, eventId) => {
  await axiosClient.delete(`${eventsUrl(gameId, roundId)}/${eventId}`);
};
