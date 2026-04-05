// controllers/usersController.js
// Controlador de usuarios: listar, actualizar rol, actualizar perfil, eliminar

import userModel from "../models/userModel.js";
import roleModel from "../models/roleModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, ERROR } from "../misc/errors.js";

/** GET /users → lista todos los usuarios (solo admin) */
export const getAll = asyncHandler(async (_req, res) => {
  const users = await userModel.getAll();
  return sendSuccess(res, { users });
});

/** PUT /users/:id/role → cambia rol de un usuario por nombre (solo admin) */
export const updateRole = asyncHandler(async (req, res, next) => {
  const { role_name } = req.body;
  if (!role_name) return next(new AppError(ERROR.INFO_NEEDED));

  const role = await roleModel.getByName(role_name);
  if (!role) return next(new AppError(ERROR.INVALID_ROLE));

  const user = await userModel.updateRole(req.params.id, role.id);
  if (!user) return next(new AppError(ERROR.USER_NOT_FOUND));

  return sendSuccess(res, { user });
});

/** PATCH /users/me → actualiza perfil del usuario autenticado */
export const updateMe = asyncHandler(async (req, res, next) => {
  const { username, phone, address } = req.body;

  const user = await userModel.updateProfile(req.user.id, {
    username,
    phone,
    address,
  });
  if (!user) return next(new AppError(ERROR.USER_NOT_FOUND));

  return sendSuccess(res, { user });
});

/** DELETE /users/:id → elimina usuario (solo admin), evita auto-eliminación */
export const remove = asyncHandler(async (req, res, next) => {
  if (req.params.id === req.user.id) {
    return next(
      new AppError(ERROR.VALIDATION, "No puedes eliminar tu propia cuenta"),
    );
  }

  const deleted = await userModel.remove(req.params.id);
  if (!deleted) return next(new AppError(ERROR.USER_NOT_FOUND));

  return sendSuccess(res, { message: "Usuario eliminado correctamente" });
});
