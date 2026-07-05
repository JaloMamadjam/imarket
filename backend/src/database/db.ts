import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

db.connect()
  .then(() => {
    console.log("✅ PostgreSQL conectado");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar PostgreSQL:", error);
  });