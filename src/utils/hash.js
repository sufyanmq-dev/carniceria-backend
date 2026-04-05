// Funciones centralizadas de bcrypt para hash y verificación de contraseñas.

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/** Hashea una contraseña */
export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

/** Verifica una contraseña contra su hash */
export const verifyPassword = (password, hash) =>
  bcrypt.compare(password, hash);
