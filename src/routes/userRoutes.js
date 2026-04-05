// routes/userRoutes.js

import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import * as usersCtrl from "../controllers/usersController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y perfil propio
 */

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Actualizar perfil propio
 *     description: Debe ir antes de /:id para evitar conflictos con rutas dinámicas.
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               phone:    { type: string }
 *               address:  { type: string }
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.patch("/me", authenticate, usersCtrl.updateMe);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuarios (admin / empleado)
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", authenticate, authorize("admin", "empleado"), usersCtrl.getAll);

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Cambiar rol de usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: empleado
 *     responses:
 *       200:
 *         description: Rol actualizado
 */
router.put("/:id/role", authenticate, authorize("admin"), usersCtrl.updateRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     description: No puedes eliminar tu propia cuenta
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router.delete("/:id", authenticate, authorize("admin"), usersCtrl.remove);

export default router;
