import { sql } from "slonik";
import db from "../config/db.js";

/** Busca un rol por nombre (cliente, empleado, admin) */
const getByName = async (name) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    SELECT id, name FROM roles WHERE name = ${name}
  `);
};

/** Lista todos los roles disponibles */
const getAll = async () => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
    SELECT id, name FROM roles ORDER BY id
  `,
    )
    .catch(() => []);
};

export default { getByName, getAll };
