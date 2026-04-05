// Router raíz de la API.
// Solo monta sub-routers en sus prefijos — sin lógica de rutas aquí.
// La documentación Swagger JSDoc está en cada archivo de rutas.

import { Router } from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";

const router = Router();

// Monta sub-routers por prefijo
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);

export default router;
