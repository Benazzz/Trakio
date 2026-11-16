import * as eventTemplateService from "../services/eventTemplates.service.js";
import parseId from "../utils/parseId.js";

export const getEventTemplates = async (req, res) => {
  const raw = req.query.zoneId;
  const zoneId = raw === undefined ? null : parseId(raw);
  if (raw !== undefined && zoneId === null)
    return res.status(400).json({ error: "zoneId must be a positive integer" });

  const templates = await eventTemplateService.fetchEventTemplates(zoneId);
  res.json(templates);
};
