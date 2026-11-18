import { axiosClient } from "./client";

export const getZones = async () => {
  const res = await axiosClient.get("/zones",);
  return res.data;
};
