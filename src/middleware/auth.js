// Autenticación y autorización con JWT

import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

// Valida que haya un token válido en la cookie
export const authenticate = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // guarda info del usuario en req
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Verifica roles permitidos para la ruta
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: "Sin permisos suficientes" });
    }
    next();
  };
