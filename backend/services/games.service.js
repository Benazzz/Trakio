import pool from "../db/pool.js";

export const fetchGames = async (limit, offset, status, isPublic) => {
  const where = `
    WHERE ($1::game_status IS NULL OR status = $1)
      AND ($2::boolean IS NULL OR is_public = $2)`;

  const result = await pool.query(
    `SELECT * FROM games ${where} ORDER BY id LIMIT $3 OFFSET $4`,
    [status, isPublic, limit, offset],
  );
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM games ${where}`,
    [status, isPublic],
  );

  return { items: result.rows, total: countResult.rows[0].count };
};
export const fetchGame = async (id) => {
  const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
  return result.rows[0];
};

export const createGame = async (data) => {
  const result = await pool.query(
    "INSERT INTO games (name, created_by, zone_id, is_public, max_players, head_start_min) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      data.name,
      data.created_by,
      data.zone_id,
      data.is_public,
      data.max_players,
      data.head_start_min,
    ],
  );
  return result.rows[0];
};

export const updateGame = async (id, data) => {
  const result = await pool.query(
    "UPDATE games SET name = $1, is_public = $2, is_locked = $3, max_players = $4, head_start_min = $5 WHERE id = $6 RETURNING *",
    [
      data.name,
      data.is_public,
      data.is_locked,
      data.max_players,
      data.head_start_min,
      id,
    ],
  );
  return result.rows[0];
};

export const deleteGame = async (id) => {
  const result = await pool.query("DELETE FROM games WHERE id = $1", [id]);
  return result.rowCount;
};
