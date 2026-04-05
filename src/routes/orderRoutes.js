import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import * as ordersCtrl from "../controllers/ordersController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Creación y seguimiento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar pedidos
 *     description: Cliente ve solo sus pedidos; empleado/admin ven todos.
 *     tags: [Pedidos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:     { type: boolean, example: true }
 *                 orders:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Order' }
 */
router.get("/", authenticate, ordersCtrl.getAll);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Detalle de un pedido
 *     description: Cliente solo puede ver sus propios pedidos.
 *     tags: [Pedidos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Pedido con items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:    { type: boolean, example: true }
 *                 order: { $ref: '#/components/schemas/Order' }
 */
router.get("/:id", authenticate, ordersCtrl.getById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear un pedido
 *     description: Cliente crea su pedido; empleado/admin pueden especificar `user_id`.
 *     tags: [Pedidos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               notes:    { type: string, example: "Sin hueso, corte fino" }
 *               user_id:  { type: string, format: uuid }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product_id, quantity]
 *                   properties:
 *                     product_id: { type: string, format: uuid }
 *                     quantity:   { type: number, example: 1.5 }
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Validación fallida
 */
router.post("/", authenticate, ordersCtrl.create);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Cambiar estado (empleado/admin)
 *     tags: [Pedidos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [pendiente, en_preparacion, entregado, cancelado] }
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.put(
  "/:id/status",
  authenticate,
  authorize("empleado", "admin"),
  ordersCtrl.updateStatus,
);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar pedido propio (cliente)
 *     description: Solo pedidos en estado `pendiente`.
 *     tags: [Pedidos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Pedido cancelado
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("cliente"),
  ordersCtrl.cancelOrder,
);

export default router;
