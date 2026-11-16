import pool from "../db/pool.js";

export const fetchEventTemplates = async (zoneId) => {
  const result = await pool.query(
    `SELECT id, type, name, description, zone_id
     FROM event_templates
     WHERE ($1::bigint IS NULL OR zone_id = $1 OR zone_id IS NULL)
     ORDER BY type, name`,
    [zoneId],
  );
  return result.rows;
};