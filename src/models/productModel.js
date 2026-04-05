import { sql } from "slonik";
import db from "../config/db.js";

// Lista todos los productos con categoría
const getAll = async () => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
      SELECT p.id, p.name, p.description, p.price, p.unit, p.is_active,
             p.category_id, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    `,
    )
    .catch(() => []);
};

// Busca un producto por UUID
const findById = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    SELECT p.id, p.name, p.description, p.price, p.unit, p.is_active,
           p.category_id, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id}
  `);
};

// Busca varios productos por array de UUIDs (usado al crear pedidos para obtener precios reales)
const findByIds = async (ids) => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
      SELECT id, name, price, unit, is_active
      FROM products
      WHERE id = ANY(${sql.array(ids, "uuid")})
    `,
    )
    .catch(() => []);
};

// Crea un producto nuevo
const create = async ({
  categoryId,
  name,
  description,
  price,
  unit,
  isActive,
}) => {
  const connection = await db;
  return connection.one(sql.unsafe`
    INSERT INTO products (category_id, name, description, price, unit, is_active)
    VALUES (
      ${categoryId ?? null},
      ${name},
      ${description ?? null},
      ${price},
      ${unit ?? "ud"},
      ${isActive ?? true}
    )
    RETURNING *
  `);
};

// Actualiza solo los campos enviados usando COALESCE
const update = async (
  id,
  { categoryId, name, description, price, unit, isActive },
) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    UPDATE products SET
      category_id = COALESCE(${categoryId ?? null}, category_id),
      name        = COALESCE(${name ?? null}, name),
      description = COALESCE(${description ?? null}, description),
      price       = COALESCE(${price ?? null}, price),
      unit        = COALESCE(${unit ?? null}, unit),
      is_active   = COALESCE(${isActive ?? null}, is_active),
      updated_at  = NOW()
    WHERE id = ${id}
    RETURNING *
  `);
};

// Elimina un producto; los order_items conservan price_at_order
const remove = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    DELETE FROM products WHERE id = ${id} RETURNING id
  `);
};

export default { getAll, findById, findByIds, create, update, remove };
