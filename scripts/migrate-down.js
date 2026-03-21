import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import db from "../src/config/db.js";
import { sql } from "slonik";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, "../migrations");

const getLastMigration = sql.unsafe`
  SELECT id
  FROM migrations
  ORDER BY id DESC
  LIMIT 1;
`;

const deleteMigration = (id) => sql.unsafe`
  DELETE FROM migrations
  WHERE id = ${id};
`;

(async () => {
  try {
    const connection = await db;

    const migrationFiles = await fs.readdir(migrationsPath);

    if (!migrationFiles.length) {
      throw new Error("No migration files found in migrations folder");
    }

    const migratedId = await connection.maybeOneFirst(getLastMigration);

    if (!migratedId) {
      throw new Error("No migrations found in control table");
    }

    if (!migrationFiles.includes(migratedId)) {
      throw new Error(
        `Migration file "${migratedId}" not found in migrations folder`,
      );
    }

    const migrationModule = await import(path.join(migrationsPath, migratedId));
    const { down } = migrationModule;

    await connection.query(down);
    await connection.query(deleteMigration(migratedId));

    console.log("> [SUCCESS] Rollback completed 💣");
  } catch (error) {
    console.error("> [ERROR]:", error.message);
    process.exit(1);
  }
})();
