import { sql } from "slonik";
import db from "../config/db.js";

/** Todos los pedidos (empleado/admin) con datos del cliente */
const getAll = async () => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
    SELECT o.id, o.status, o.notes, o.total, o.created_at, o.updated_at,
           u.username AS client_name, u.phone AS client_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `,
    )
    .catch(() => []);
};

/** Pedidos de un cliente específico */
const getByUserId = async (userId) => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
    SELECT o.id, o.status, o.notes, o.total, o.created_at, o.updated_at,
           u.username AS client_name, u.phone AS client_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.user_id = ${userId}
    ORDER BY o.created_at DESC
  `,
    )
    .catch(() => []);
};

/** Pedido por ID con datos del cliente */
const findById = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    SELECT o.id, o.status, o.notes, o.total, o.created_at, o.updated_at,
           u.id AS user_id, u.username AS client_name,
           u.phone AS client_phone, u.address AS client_address
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ${id}
  `);
};

/** Items de un pedido con nombre de producto */
const getItems = async (orderId) => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
    SELECT oi.id, oi.quantity, oi.price_at_order,
           p.name AS product_name, p.id AS product_id, p.unit
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${orderId}
  `,
    )
    .catch(() => []);
};

/** Crea un pedido */
const create = async ({ userId, notes, total }) => {
  const connection = await db;
  return connection.one(sql.unsafe`
    INSERT INTO orders (user_id, notes, total)
    VALUES (${userId}, ${notes ?? null}, ${total})
    RETURNING *
  `);
};

/** Inserta un item en un pedido */
const createItem = async ({ orderId, productId, quantity, priceAtOrder }) => {
  const connection = await db;
  return connection.query(sql.unsafe`
    INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
    VALUES (${orderId}, ${productId}, ${quantity}, ${priceAtOrder})
  `);
};

/** Actualiza estado de un pedido */
const updateStatus = async (id, status) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    UPDATE orders
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `);
};

export default {
  getAll,
  getByUserId,
  findById,
  getItems,
  create,
  createItem,
  updateStatus,
};
