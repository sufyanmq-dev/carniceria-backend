import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, "../migrations");

const template = `import { sql } from "slonik";

export const up = sql.unsafe\`\`;

export const down = sql.unsafe\`\`;
`;

(async () => {
  try {
    const [, , name] = process.argv;
    if (!name) {
      throw new Error("Debes indicar un nombre para la migración");
    }

    const sanitized = name.replace(/\s+/g, "_").toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const fileName = `${timestamp}_${sanitized}.js`;
    const filePath = path.join(migrationsPath, fileName);

    await fs.writeFile(filePath, template);

    console.log(`> [SUCCESS] Migration created: ${fileName}`);
  } catch (error) {
    console.error("> [ERROR]:", error.message);
  }
})();
