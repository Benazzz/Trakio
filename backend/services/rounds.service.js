import pool from "../db/pool.js";

export const fetchRounds = async (gameId) => {
  const result = await pool.query(
    "SELECT * FROM rounds WHERE game_id = $1 ORDER BY round_number",
    [gameId],
  );
  return result.rows;
};

export const fetchRound = async (gameId, roundId) => {
  const result = await pool.query(
    "SELECT * FROM rounds WHERE game_id = $1 AND id = $2",
    [gameId, roundId],
  );
  return result.rows[0];
};

export const createRound = async (gameId) => {
  const result = await pool.query(
    "INSERT INTO rounds (game_id, round_number) SELECT $1, COALESCE(MAX(round_number), 0) + 1 FROM rounds WHERE game_id = $1 RETURNING *",
    [gameId],
  );
  return result.rows[0];
};

export const updateRound = async (gameId, roundId, data) => {
  const result = await pool.query(
    "UPDATE rounds SET status = $1, started_at = $2, ended_at = $3, found_by = $4 WHERE id = $5 AND game_id = $6 RETURNING *",
    [
      data.status,
      data.started_at,
      data.ended_at,
      data.found_by,
      roundId,
      gameId,
    ],
  );
  return result.rows[0];
};

export const deleteRound = async (gameId, roundId) => {
  const result = await pool.query("DELETE FROM rounds WHERE id = $1 AND game_id = $2", [roundId, gameId]);
  return result.rowCount;
};

