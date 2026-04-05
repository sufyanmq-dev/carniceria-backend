// Verifica JWT en cookie httpOnly y adjunta payload a req.user

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import { AppError, ERROR } from "../misc/errors.js";

/** Middleware que verifica la cookie `token` */
export const authenticate = (req, _res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    // Usuario no autenticado
    return next(new AppError(ERROR.NOT_AUTHENTICATED));
  }

  try {
    // Decodifica JWT y lo adjunta a req.user
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    // Token inválido o expirado
    next(new AppError(ERROR.INVALID_TOKEN));
  }
};
