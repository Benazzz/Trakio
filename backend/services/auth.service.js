import pool from "../db/pool.js";

export const getUserByEmailOrUsername = async (email, username) => {
  const result = await pool.query(
    "SELECT id FROM users WHERE (email = $1 AND deleted_at IS NULL) OR username = $2",
    [email, username],
  );
  return result.rows[0];
};

export const createUser = async (email, username, password_hash) => {
  const result = await pool.query(
    "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, role, is_blocked, avatar_url, created_at",
    [email, username, password_hash],
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, password_hash, role, is_blocked FROM users WHERE email = $1 AND deleted_at IS NULL",
    [email],
  );
  return result.rows[0];
};

export const saveRefreshToken = async (userId, tokenHash) => {
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '7 days')",
    [userId, tokenHash],
  );
};

export const findValidRefreshToken = async (tokenHash) => {
  const result = await pool.query(
    "SELECT rt.id AS token_id, u.id AS user_id, u.role, u.is_blocked, u.deleted_at FROM refresh_tokens AS rt JOIN users AS u ON u.id = rt.user_id WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()",
    [tokenHash],
  );
  return result.rows[0];
};

export const cancelRefreshToken = async (tokenId) => {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1 ",
    [tokenId],
  );
};
