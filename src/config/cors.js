// Configuración de CORS según entorno (dev / prod)

import "dotenv/config";

const { FRONTEND_URL, NODE_ENV } = process.env;

// Lista de orígenes permitidos
const allowedOrigins =
  NODE_ENV === "production"
    ? [FRONTEND_URL].filter(Boolean) // solo producción
    : [
        "http://localhost:5173", // Vite
        "http://localhost:3000", // React alternativa
        FRONTEND_URL,
      ].filter(Boolean);

export const corsOptions = {
  // Valida el origin de cada petición
  origin: (origin, callback) => {
    // Permite requests sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origen bloqueado: ${origin}`);
      callback(new Error(`CORS: origen no permitido → ${origin}`));
    }
  },

  // Necesario para cookies en el navegador
  credentials: true,
};
