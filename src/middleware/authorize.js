// Middleware de autorización por rol, debe ir después de authenticate

import { AppError, ERROR } from "../misc/errors.js";

/** Genera middleware que restringe acceso según roles permitidos */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      console.log(
        "USER:",
        req.user,
        "ROLE:",
        req.user?.role,
        "ALLOWED:",
        roles,
      );
      return next(new AppError(ERROR.FORBIDDEN));
    }
    next();
  };
};
