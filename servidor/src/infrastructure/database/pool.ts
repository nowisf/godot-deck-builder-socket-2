// db.ts
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres", // tu usuario de Postgres
  host: "localhost",
  database: "td_versus", // la DB que creaste
  password: "123qweasd", // la contraseña que pusiste
  port: 5432,
});

export default pool;
