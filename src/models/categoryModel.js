import { sql } from "slonik";
import db from "../config/db.js";

/** Devuelve todas las categorías ordenadas por nombre */
const getAll = async () => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
    SELECT id, name, description, created_at FROM categories ORDER BY name
  `,
    )
    .catch(() => []);
};

/** Busca categoría por ID */
const findById = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    SELECT id, name, description FROM categories WHERE id = ${id}
  `);
};

/** Crea una nueva categoría */
const create = async ({ name, description }) => {
  const connection = await db;
  return connection.one(sql.unsafe`
    INSERT INTO categories (name, description)
    VALUES (${name}, ${description ?? null})
    RETURNING *
  `);
};

/** Actualiza categoría (solo campos enviados) */
const update = async (id, { name, description }) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    UPDATE categories SET
      name        = COALESCE(${name ?? null}, name),
      description = COALESCE(${description ?? null}, description),
      updated_at  = NOW()
    WHERE id = ${id}
    RETURNING *
  `);
};

/** Elimina categoría (productos quedan con category_id = NULL) */
const remove = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    DELETE FROM categories WHERE id = ${id} RETURNING id
  `);
};

export default { getAll, findById, create, update, remove };
