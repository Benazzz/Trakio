import express from "express";
import pool from "./db/pool.js";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health", async (req, res) => {
  const result = await pool.query("SELECT now()");
  res.json(result.rows[0]);
});

export default app;
