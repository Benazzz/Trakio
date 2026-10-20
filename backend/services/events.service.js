import pool from "../db/pool.js";

export const fetchEvents = async (roundId) => {
  const result = await pool.query(
    "SELECT * FROM events WHERE round_id = $1 ORDER BY created_at",
    [roundId],
  );
  return result.rows;
};

export const fetchEvent = async (roundId, eventId) => {
  const result = await pool.query(
    "SELECT * FROM events WHERE round_id = $1 AND id = $2",
    [roundId, eventId],
  );
  return result.rows[0];
};

export const createEvent = async (roundId, data) => {
  const result = await pool.query(
    "INSERT INTO events (round_id, template_id, created_by) VALUES ($1, $2, $3) RETURNING *",
    [roundId, data.template_id, data.created_by],
  );
  return result.rows[0];
};

export const updateEvent = async (roundId, eventId, data) => {
  const result = await pool.query(
    "UPDATE events SET status = $1, answer = $2, resolved_by = $3, resolved_at = $4 WHERE round_id = $5 AND id = $6 RETURNING *",
    [
      data.status,
      data.answer,
      data.resolved_by,
      data.resolved_at,
      roundId,
      eventId,
    ],
  );
  return result.rows[0];
};

export const deleteEvent = async (roundId, eventId) => {
  const result = await pool.query(
    "DELETE FROM events WHERE round_id = $1 AND id = $2",
    [roundId, eventId],
  );
  return result.rowCount;
};
