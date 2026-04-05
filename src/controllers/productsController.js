import productModel from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, ERROR } from "../misc/errors.js";

const VALID_UNITS = ["kg", "ud"];

// GET /products — todos los productos con categoría
export const getAll = asyncHandler(async (_req, res) => {
  const products = await productModel.getAll();
  return sendSuccess(res, { products });
});

// GET /products/:id
export const getById = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) return next(new AppError(ERROR.PRODUCT_NOT_FOUND));
  return sendSuccess(res, { product });
});

// POST /products — solo admin
export const create = asyncHandler(async (req, res, next) => {
  const { name, description, price, unit, is_active, category_id } = req.body;

  if (!name || price == null) return next(new AppError(ERROR.INFO_NEEDED));
  if (unit && !VALID_UNITS.includes(unit)) {
    return next(
      new AppError(
        ERROR.VALIDATION,
        `Unidad inválida. Valores: ${VALID_UNITS.join(", ")}`,
      ),
    );
  }

  const product = await productModel.create({
    categoryId: category_id ?? null,
    name,
    description,
    price,
    unit: unit ?? "ud",
    isActive: is_active,
  });

  return sendSuccess(res, { product }, 201);
});

// PUT /products/:id — solo admin
export const update = asyncHandler(async (req, res, next) => {
  const { name, description, price, unit, is_active, category_id } = req.body;

  if (unit && !VALID_UNITS.includes(unit)) {
    return next(
      new AppError(
        ERROR.VALIDATION,
        `Unidad inválida. Valores: ${VALID_UNITS.join(", ")}`,
      ),
    );
  }

  const product = await productModel.update(req.params.id, {
    categoryId: category_id,
    name,
    description,
    price,
    unit,
    isActive: is_active,
  });

  if (!product) return next(new AppError(ERROR.PRODUCT_NOT_FOUND));
  return sendSuccess(res, { product });
});

// DELETE /products/:id — solo admin
export const remove = asyncHandler(async (req, res, next) => {
  const deleted = await productModel.remove(req.params.id);
  if (!deleted) return next(new AppError(ERROR.PRODUCT_NOT_FOUND));
  return sendSuccess(res, { message: "Producto eliminado correctamente" });
});
