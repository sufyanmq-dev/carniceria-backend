// Crea el pool de conexión a PostgreSQL con Slonik

import "dotenv/config";
import { createPool } from "slonik";

const { DB_URL } = process.env;

// Comprueba que exista la URL de la DB
if (!DB_URL) {
  console.error("[DB] Falta la variable DB_URL en .env");
  process.exit(1);
}

// Pool de conexiones (se usa con await en otros archivos)
const db = createPool(DB_URL);

export default db;
