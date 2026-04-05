import roleModel from "../models/roleModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

/**
 * GET /roles
 * Lista todos los roles disponibles (solo admin).
 * Necesario para que el frontend pueda mostrar opciones al cambiar rol de usuario.
 */
export const getAll = asyncHandler(async (_req, res) => {
  const roles = await roleModel.getAll();
  return sendSuccess(res, { roles });
});
