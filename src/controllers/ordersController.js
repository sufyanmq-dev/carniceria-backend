import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, ERROR } from "../misc/errors.js";

const VALID_STATUSES = [
  "pendiente",
  "en_preparacion",
  "entregado",
  "cancelado",
];

// GET /orders — cliente ve los suyos, empleado/admin ven todos
export const getAll = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const orders =
    role === "cliente"
      ? await orderModel.getByUserId(userId)
      : await orderModel.getAll();
  return sendSuccess(res, { orders });
});

// GET /orders/:id — cliente solo puede ver los suyos
export const getById = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) return next(new AppError(ERROR.ORDER_NOT_FOUND));

  if (req.user.role === "cliente" && order.user_id !== req.user.id) {
    return next(new AppError(ERROR.FORBIDDEN));
  }

  const items = await orderModel.getItems(order.id);
  return sendSuccess(res, { order: { ...order, items } });
});

// POST /orders — crea pedido con items
export const create = asyncHandler(async (req, res, next) => {
  const { notes, items, user_id } = req.body;
  const { role, id: requesterId } = req.user;

  const clientId = role === "cliente" ? requesterId : (user_id ?? requesterId);

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError(ERROR.EMPTY_ORDER));
  }

  const productIds = items.map((i) => i.product_id);
  const products = await productModel.findByIds(productIds);
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap[item.product_id];
    if (!product)
      return next(
        new AppError(
          ERROR.PRODUCT_NOT_FOUND,
          `Producto ${item.product_id} no encontrado`,
        ),
      );
    if (!product.is_active)
      return next(
        new AppError(ERROR.VALIDATION, `"${product.name}" no está disponible`),
      );
    if (!item.quantity || item.quantity <= 0)
      return next(new AppError(ERROR.INVALID_QUANTITY));
  }

  const total = items.reduce(
    (sum, item) => sum + productMap[item.product_id].price * item.quantity,
    0,
  );

  const order = await orderModel.create({ userId: clientId, notes, total });

  for (const item of items) {
    await orderModel.createItem({
      orderId: order.id,
      productId: item.product_id,
      quantity: item.quantity,
      priceAtOrder: productMap[item.product_id].price,
    });
  }

  return sendSuccess(res, { order: { ...order, items } }, 201);
});

// PUT /orders/:id/status — empleado y admin
export const updateStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new AppError(ERROR.INFO_NEEDED));
  if (!VALID_STATUSES.includes(status))
    return next(new AppError(ERROR.INVALID_STATUS));

  const order = await orderModel.updateStatus(req.params.id, status);
  if (!order) return next(new AppError(ERROR.ORDER_NOT_FOUND));
  return sendSuccess(res, { order });
});

// PATCH /orders/:id/cancel — cliente cancela su propio pedido si está pendiente
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) return next(new AppError(ERROR.ORDER_NOT_FOUND));

  if (order.user_id !== req.user.id) {
    return next(new AppError(ERROR.FORBIDDEN));
  }

  if (order.status !== "pendiente") {
    return next(
      new AppError(
        ERROR.VALIDATION,
        "Solo se pueden cancelar pedidos en estado pendiente",
      ),
    );
  }

  const cancelled = await orderModel.updateStatus(req.params.id, "cancelado");
  return sendSuccess(res, { order: cancelled });
});
