import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import * as productsCtrl from "../controllers/productsController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión del catálogo de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar todos los productos
 *     description: Devuelve todos los productos con su categoría. Accesible para cualquier usuario autenticado.
 *     tags: [Productos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:       { type: boolean, example: true }
 *                 products:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 */
router.get("/", authenticate, productsCtrl.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:      { type: boolean, example: true }
 *                 product: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get("/:id", authenticate, productsCtrl.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:        { type: string, example: "Chuletón de Ávila" }
 *               description: { type: string, example: "Corte premium de vacuno mayor" }
 *               price:       { type: number, example: 28.5 }
 *               unit:
 *                 type: string
 *                 enum: [kg, ud]
 *                 default: ud
 *                 example: kg
 *               is_active:   { type: boolean, example: true }
 *               category_id: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:      { type: boolean, example: true }
 *                 product: { $ref: '#/components/schemas/Product' }
 */
router.post("/", authenticate, authorize("admin"), productsCtrl.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto (solo admin)
 *     description: Solo se actualizan los campos enviados; los demás conservan su valor actual.
 *     tags: [Productos]
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
 *               name:        { type: string }
 *               description: { type: string }
 *               price:       { type: number }
 *               unit:
 *                 type: string
 *                 enum: [kg, ud]
 *               is_active:   { type: boolean }
 *               category_id: { type: integer }
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:      { type: boolean, example: true }
 *                 product: { $ref: '#/components/schemas/Product' }
 */
router.put("/:id", authenticate, authorize("admin"), productsCtrl.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto (solo admin)
 *     description: Los order_items existentes conservan el precio histórico.
 *     tags: [Productos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:      { type: boolean, example: true }
 *                 message: { type: string, example: "Producto eliminado correctamente" }
 */
router.delete("/:id", authenticate, authorize("admin"), productsCtrl.remove);

export default router;
