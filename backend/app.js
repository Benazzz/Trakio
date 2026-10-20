import express from "express";
import pool from "./db/pool.js";
import gamesRouter from "./routes/games.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import unknownRoute from "./middleware/unknownRoute.js";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health", async (req, res) => {
  const result = await pool.query("SELECT now()");
  res.json(result.rows[0]);
});

app.use("/games", gamesRouter);
app.use(unknownRoute);
app.use(errorHandler);

export default app;
