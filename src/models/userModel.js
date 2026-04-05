import { sql } from "slonik";
import db from "../config/db.js";

/** Busca usuario por email (incluye password_hash para login) */
const findByEmail = async (email) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    SELECT u.id, u.username, u.email, u.password_hash,
           u.phone, u.address, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ${email}
  `);
};

/** Busca usuario por ID (sin password_hash) */
const findById = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    SELECT u.id, u.username, u.email, u.phone, u.address,
           u.created_at, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ${id}
  `);
};

/** Crea un nuevo usuario */
const create = async ({
  roleId,
  username,
  email,
  passwordHash,
  phone,
  address,
}) => {
  const connection = await db;
  return connection.one(sql.unsafe`
    INSERT INTO users (role_id, username, email, password_hash, phone, address)
    VALUES (${roleId}, ${username}, ${email}, ${passwordHash}, ${phone ?? null}, ${address ?? null})
    RETURNING id, username, email, phone, address
  `);
};

/** Lista todos los usuarios con su rol */
const getAll = async () => {
  const connection = await db;
  return connection
    .many(
      sql.unsafe`
    SELECT u.id, u.username, u.email, u.phone, u.address,
           u.created_at, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
  `,
    )
    .catch(() => []);
};

/** Cambia el rol de un usuario */
const updateRole = async (id, roleId) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    UPDATE users
    SET role_id = ${roleId}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, username, email
  `);
};

/** Actualiza datos de perfil de un usuario */
const updateProfile = async (id, { username, phone, address }) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    UPDATE users SET
      username   = COALESCE(${username ?? null}, username),
      phone      = COALESCE(${phone ?? null}, phone),
      address    = COALESCE(${address ?? null}, address),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, username, email, phone, address
  `);
};

/** Elimina un usuario por ID */
const remove = async (id) => {
  const connection = await db;
  return connection.maybeOne(sql.unsafe`
    DELETE FROM users WHERE id = ${id} RETURNING id
  `);
};

export default {
  findByEmail,
  findById,
  create,
  getAll,
  updateRole,
  updateProfile,
  remove,
};
