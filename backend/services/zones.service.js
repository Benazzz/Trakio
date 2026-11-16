import pool from "../db/pool.js";

export const fetchZones = async () => {
  const result = await pool.query(
    "SELECT id, city, name FROM zones ORDER BY city, name"
  );
  return result.rows;
};