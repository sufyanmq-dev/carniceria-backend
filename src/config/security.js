// Middleware de seguridad global para Express

import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./cors.js";
import { generalLimiter } from "../middleware/rateLimiter.js";

/**
 * Aplica todos los middlewares de seguridad a la app
 * @param {import("express").Application} app
 */
const configureSecurityMiddleware = (app) => {
  app.use(helmet()); // cabeceras de seguridad (XSS, clickjacking, etc.)
  app.use(generalLimiter); // rate limit global: 100 req / 15 min por IP
  app.use(cors(corsOptions)); // CORS según entorno
  app.use(cookieParser()); // parsea cookies (JWT httpOnly)
};

export default configureSecurityMiddleware;
