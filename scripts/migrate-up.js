import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import db from "../src/config/db.js";
import { sql } from "slonik";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, "../migrations");

const createControlTable = sql.unsafe`
  CREATE TABLE IF NOT EXISTS migrations (
    id VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

const getMigratedIds = sql.unsafe`
  SELECT id FROM migrations;
`;

const insertMigration = (id) => sql.unsafe`
  INSERT INTO migrations (id)
  VALUES (${id});
`;

async function runMigrations() {
  const migrationsDir = await fs.readdir(migrationsPath);

  if (!migrationsDir.length) {
    throw Error("No migration files found");
  }

  const connection = await db;

  await connection.query(createControlTable);

  const migratedIdsResult = await connection.query(getMigratedIds);
  const migratedSet = new Set(migratedIdsResult.rows.map(({ id }) => id));

  for (const file of migrationsDir) {
    if (migratedSet.has(file)) {
      console.log(`> file ${file} migrated, skipping...`);
      continue;
    }

    const migrationPath = path.join(migrationsPath, file);

    const migration = await import(migrationPath);

    await connection.query(migration.up);
    await connection.query(insertMigration(file));
  }
}

(async () => {
  try {
    await runMigrations();
    console.log("> [SUCCESS]: migrations done! ✅");
  } catch (error) {
    console.log("> [ERROR]:", error.message);
  }
})();
