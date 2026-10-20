import pg from "pg";
import "dotenv/config";

pg.types.setTypeParser(20, Number);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err.message);
});

export default pool;
