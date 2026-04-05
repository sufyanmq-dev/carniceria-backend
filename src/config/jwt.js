// Configuración central de JWT y cookies

import "dotenv/config";

const { JWT_SECRET, JWT_EXPIRES_IN = "8h", NODE_ENV } = process.env;

// Comprueba que el secret exista
if (!JWT_SECRET) {
  console.error("[JWT] JWT_SECRET no está definida");
  console.error(
    "[JWT] Genera uno con: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
  );
  process.exit(1);
}

// Opciones del token
export const JWT_OPTIONS = {
  expiresIn: JWT_EXPIRES_IN,
};

// Config de la cookie que guarda el JWT
export const COOKIE_OPTIONS = {
  httpOnly: true, // no accesible desde JS
  secure: true, // obligatorio para cross-domain
  sameSite: "none", // necesario para cross-domain
  path: "/", // disponible en toda la API
  maxAge: 8 * 60 * 60 * 1000, // 8h
};

// Opciones para borrar la cookie (logout)
export const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "strict",
  path: "/",
};

export { JWT_SECRET };
