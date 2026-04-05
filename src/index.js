// Entrada de la API Express

import "dotenv/config";

import express, { json } from "express";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
import configureSecurityMiddleware from "./config/security.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const API_PORT = process.env.PORT ?? 5001;
const app = express();

// Seguridad: CORS, Helmet, rate limit, cookies
configureSecurityMiddleware(app);

// Parseo JSON (captura JSON malformado)
app.use(json());

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use("/api", router);

// Health check
app.get("/", (_req, res) =>
  res.json({ ok: true, message: "CarniOrder API running 🥩" }),
);

// Error handler global
app.use(errorHandler);

// Levanta servidor
app.listen(API_PORT, () => {
  console.log(`\n🥩  CarniOrder API`);
  console.log(`   Puerto:  ${API_PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`   Docs:    http://localhost:${API_PORT}/api/docs\n`);
});
