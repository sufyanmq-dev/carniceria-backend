// Rate limiting: general y específico para auth (prevención fuerza bruta)

import rateLimit from "express-rate-limit";

/** Mensaje uniforme para rate limit excedido */
const rateLimitResponse = (message) => ({
  ok: false,
  code: "rateLimitExceeded",
  message,
});

// Límite global: 100 req / 15 min por IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse(
    "Demasiadas peticiones. Inténtalo de nuevo en 15 minutos.",
  ),
});

// Límite para auth: 10 intentos / 15 min por IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse(
    "Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.",
  ),
});
