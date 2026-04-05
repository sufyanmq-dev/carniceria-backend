import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import * as categoriesCtrl from "../controllers/categoriesController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Gestión de categorías de productos
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorías]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", authenticate, categoriesCtrl.getAll);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear categoría (solo admin)
 *     tags: [Categorías]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:        { type: string, example: Vacuno }
 *               description: { type: string, example: Carne de vaca y ternera }
 *     responses:
 *       201: { description: Categoría creada }
 *       409: { description: Categoría ya existe }
 */
router.post("/", authenticate, authorize("admin"), categoriesCtrl.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar categoría (solo admin)
 *     tags: [Categorías]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Categoría actualizada }
 *       404: { description: Categoría no encontrada }
 */
router.put("/:id", authenticate, authorize("admin"), categoriesCtrl.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar categoría (solo admin)
 *     tags: [Categorías]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Categoría eliminada }
 *       404: { description: Categoría no encontrada }
 */
router.delete("/:id", authenticate, authorize("admin"), categoriesCtrl.remove);

export default router;
