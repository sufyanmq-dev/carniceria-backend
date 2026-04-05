import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import * as authCtrl from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro, login y sesión
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario (cliente por defecto)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string, example: sufyan }
 *               email:    { type: string, example: sufyan@test.com }
 *               password: { type: string, example: "123456" }
 *               phone:    { type: string, example: "612345678" }
 *               address:  { type: string, example: "Calle Mayor 1" }
 *     responses:
 *       201: { description: Usuario creado correctamente }
 *       400: { description: Faltan campos obligatorios, content: { "application/json": { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
 *       409: { description: Email ya registrado, content: { "application/json": { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
 */
router.post("/register", authLimiter, authCtrl.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión (cookie JWT httpOnly)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: sufyan@test.com }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200: { description: Login correcto, cookie establecida }
 *       401: { description: Email o contraseña incorrectos, content: { "application/json": { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
 */
router.post("/login", authLimiter, authCtrl.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión (elimina cookie JWT)
 *     tags: [Auth]
 *     responses:
 *       200: { description: Sesión cerrada correctamente }
 */
router.post("/logout", authCtrl.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:   { type: boolean, example: true }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401: { description: No autenticado, content: { "application/json": { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
 */
router.get("/me", authenticate, authCtrl.me);

export default router;
