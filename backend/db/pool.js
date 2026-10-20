import pg from "pg";
import "dotenv/config";

pg.types.setTypeParser(20, Number);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export default pool;
