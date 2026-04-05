// Controlador de autenticación: register, login, logout, me

import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import roleModel from "../models/roleModel.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError, ERROR } from "../misc/errors.js";
import {
  JWT_SECRET,
  JWT_OPTIONS,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from "../config/jwt.js";

// ── Helpers privados ──

/** Payload codificado en JWT */
const buildTokenPayload = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});

/** Datos públicos del usuario (sin password) */
const buildPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});

// ── Controllers ──

/** POST /auth/register → crea usuario cliente */
export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, phone, address } = req.body;

  if (!username || !email || !password)
    return next(new AppError(ERROR.INFO_NEEDED));

  const existing = await userModel.findByEmail(email);
  if (existing) return next(new AppError(ERROR.EMAIL_EXISTS));

  const clientRole = await roleModel.getByName("cliente");
  const passwordHash = await hashPassword(password);

  const user = await userModel.create({
    roleId: clientRole.id,
    username,
    email,
    passwordHash,
    phone,
    address,
  });

  return sendSuccess(res, { user }, 201);
});

/** POST /auth/login → verifica credenciales y devuelve JWT en cookie */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError(ERROR.INFO_NEEDED));

  const user = await userModel.findByEmail(email);
  if (!user) return next(new AppError(ERROR.INVALID_CREDENTIALS));

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return next(new AppError(ERROR.INVALID_CREDENTIALS));

  const token = jwt.sign(buildTokenPayload(user), JWT_SECRET, JWT_OPTIONS);
  res.cookie("token", token, COOKIE_OPTIONS);

  return sendSuccess(res, { user: buildPublicUser(user) });
});

/** POST /auth/logout → limpia cookie JWT */
export const logout = (_req, res) => {
  res.clearCookie("token", CLEAR_COOKIE_OPTIONS);
  return sendSuccess(res, { message: "Sesión cerrada correctamente" });
};

/** GET /auth/me → datos del usuario autenticado */
export const me = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) return next(new AppError(ERROR.USER_NOT_FOUND));
  return sendSuccess(res, { user });
});
