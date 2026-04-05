import categoryModel from "../models/categoryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, ERROR } from "../misc/errors.js";

/** GET /categories — Lista todas las categorías */
export const getAll = asyncHandler(async (_req, res) => {
  const categories = await categoryModel.getAll();
  return sendSuccess(res, { categories });
});

/** POST /categories — Crea una categoría (solo admin) */
export const create = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name?.trim()) return next(new AppError(ERROR.INFO_NEEDED));

  try {
    const category = await categoryModel.create({
      name: name.trim(),
      description,
    });
    return sendSuccess(res, { category }, 201);
  } catch (err) {
    // Violación de unicidad de PostgreSQL (código 23505)
    if (err.message?.includes("unique") || err.code === "23505") {
      return next(new AppError(ERROR.CATEGORY_EXISTS));
    }
    throw err; // re-lanza para que asyncHandler lo pase al errorHandler
  }
});

/** PUT /categories/:id — Actualiza una categoría (solo admin) */
export const update = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await categoryModel.update(req.params.id, {
    name,
    description,
  });
  if (!category) return next(new AppError(ERROR.CATEGORY_NOT_FOUND));

  return sendSuccess(res, { category });
});

/** DELETE /categories/:id — Elimina una categoría (solo admin) */
export const remove = asyncHandler(async (req, res, next) => {
  const deleted = await categoryModel.remove(req.params.id);
  if (!deleted) return next(new AppError(ERROR.CATEGORY_NOT_FOUND));

  return sendSuccess(res, { message: "Categoría eliminada correctamente" });
});
