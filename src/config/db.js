import "dotenv/config";
import { createPool } from "slonik";
const { DB_URL } = process.env;

const db = createPool(DB_URL);

export default db;
