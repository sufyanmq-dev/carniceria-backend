import { getError, ERROR } from "../misc/errors.js";
import { sendError } from "../utils/response.js";

/**
 * Middleware global de errores de Express.
 * Captura AppError, errores inesperados, CORS y body JSON inválido.
 */
export const errorHandler = (err, req, res, _next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR ${req.method} ${req.path}`);
  console.error(`  → ${err.name ?? "Error"}: ${err.message}`);
  if (process.env.NODE_ENV !== "production" && err.stack)
    console.error(err.stack);

  // Error controlado
  if (err.name === "AppError")
    return sendError(res, err.status, err.code, err.message);

  // JSON inválido
  if (err.type === "entity.parse.failed") {
    return sendError(res, 400, "invalidJson", "Cuerpo no es JSON válido");
  }

  // CORS bloqueado
  if (err.message?.startsWith("CORS:")) {
    return sendError(res, 403, "corsBlocked", "Origen no permitido");
  }

  // Error inesperado: enviamos mensaje genérico al cliente
  const fallback = getError(ERROR.API_ERROR);
  return sendError(res, fallback.status, ERROR.API_ERROR, fallback.message);
};
