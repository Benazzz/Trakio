import * as zoneService from "../services/zones.service.js";

export const getZones = async (req, res) => {
  const zones = await zoneService.fetchZones();
  res.json(zones);
};