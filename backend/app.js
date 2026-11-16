import express from "express";
import cors from "cors";
import pool from "./db/pool.js";
import gamesRouter from "./routes/games.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import unknownRoute from "./middleware/unknownRoute.js";
import authRouter from "./routes/auth.routes.js";
import zonesRouter from "./routes/zones.routes.js";
import eventTemplatesRouter from "./routes/eventTemplates.routes.js";

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health", async (req, res) => {
  const result = await pool.query("SELECT now()");
  res.json(result.rows[0]);
});

app.use("/auth", authRouter);
app.use("/games", gamesRouter);
app.use("/zones", zonesRouter);
app.use("/event-templates", eventTemplatesRouter);
app.use(unknownRoute);
app.use(errorHandler);

export default app;
