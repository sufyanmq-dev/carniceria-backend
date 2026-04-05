import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import * as rolesCtrl from "../controllers/rolesController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión y listado de roles disponibles
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Listar todos los roles (solo admin)
 *     tags: [Roles]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:    { type: boolean, example: true }
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:   { type: integer, example: 1 }
 *                       name: { type: string, example: "cliente" }
 *       403:
 *         description: Sin permisos para acceder a los roles
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get("/", authenticate, authorize("admin"), rolesCtrl.getAll);

export default router;
