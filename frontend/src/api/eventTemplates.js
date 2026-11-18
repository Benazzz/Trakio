import { axiosClient } from "./client";

export const getEventTemplates = async (zoneId) => {
  const res = await axiosClient.get("/event-templates", {
    params: { zoneId },
  });
  return res.data;
};
