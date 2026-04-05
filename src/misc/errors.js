// Catálogo centralizado de errores y clase AppError.
// Los controllers lanzan AppError; errorHandler los captura.

// ── Índice de códigos ─────────────────────────────────────────────────────────
export const ERROR = {
  // 400 — Petición incorrecta
  INFO_NEEDED: "infoNeeded",
  VALIDATION: "validation",
  INVALID_STATUS: "invalidStatus",
  INVALID_QUANTITY: "invalidQuantity",
  INVALID_ROLE: "invalidRole",
  EMPTY_ORDER: "emptyOrder",

  // 401 — No autenticado
  NOT_AUTHENTICATED: "notAuthenticated",
  INVALID_TOKEN: "invalidToken",
  INVALID_CREDENTIALS: "invalidCredentials",

  // 403 — Sin permisos
  FORBIDDEN: "forbidden",

  // 404 — No encontrado
  USER_NOT_FOUND: "userNotFound",
  ORDER_NOT_FOUND: "orderNotFound",
  PRODUCT_NOT_FOUND: "productNotFound",
  CATEGORY_NOT_FOUND: "categoryNotFound",
  ROLE_NOT_FOUND: "roleNotFound",

  // 409 — Conflicto
  EMAIL_EXISTS: "emailExists",
  CATEGORY_EXISTS: "categoryExists",

  // 500 — Error interno
  API_ERROR: "apiError",
  DB_ERROR: "dbError",
};

// ── Catálogo: status HTTP + mensaje para el cliente ───────────────────────────
const errorCatalog = {
  // 400
  infoNeeded: { status: 400, message: "Faltan campos obligatorios" },
  validation: { status: 400, message: "Los datos enviados no son válidos" },
  invalidStatus: {
    status: 400,
    message:
      "Estado de pedido no válido. Valores posibles: pendiente, en_preparacion, entregado, cancelado",
  },
  invalidQuantity: {
    status: 400,
    message: "La cantidad debe ser mayor que cero",
  },
  invalidRole: { status: 400, message: "El rol especificado no existe" },
  emptyOrder: {
    status: 400,
    message: "El pedido debe tener al menos un producto",
  },

  // 401
  notAuthenticated: {
    status: 401,
    message: "No autenticado. Inicia sesión para continuar",
  },
  invalidToken: {
    status: 401,
    message: "Sesión expirada o inválida. Vuelve a iniciar sesión",
  },
  invalidCredentials: {
    status: 401,
    message: "Email o contraseña incorrectos",
  },

  // 403
  forbidden: {
    status: 403,
    message: "No tienes permisos para realizar esta acción",
  },

  // 404
  userNotFound: { status: 404, message: "Usuario no encontrado" },
  orderNotFound: { status: 404, message: "Pedido no encontrado" },
  productNotFound: { status: 404, message: "Producto no encontrado" },
  categoryNotFound: { status: 404, message: "Categoría no encontrada" },
  roleNotFound: { status: 404, message: "Rol no encontrado" },

  // 409
  emailExists: { status: 409, message: "Este email ya está registrado" },
  categoryExists: {
    status: 409,
    message: "Ya existe una categoría con ese nombre",
  },

  // 500
  apiError: { status: 500, message: "Error interno del servidor" },
  dbError: { status: 500, message: "Error de base de datos" },
};

// ── Clase de error tipado ─────────────────────────────────────────────────────
/**
 * Error de aplicación con código semántico, status HTTP y mensaje seguro.
 * Se lanza desde controllers y se captura en middleware/errorHandler.js.
 *
 * @param {string} code            - Clave del índice ERROR
 * @param {string} [customMessage] - Sobreescribe el mensaje del catálogo
 *
 * @example
 *   throw new AppError(ERROR.USER_NOT_FOUND);
 *   throw new AppError(ERROR.VALIDATION, "El precio debe ser positivo");
 */
export class AppError extends Error {
  constructor(code, customMessage) {
    const entry = errorCatalog[code] ?? errorCatalog.apiError;
    super(customMessage ?? entry.message);
    this.code = code ?? ERROR.API_ERROR;
    this.status = entry.status;
    this.name = "AppError";
  }
}

// Devuelve info del error desde el catálogo
export const getError = (code) => errorCatalog[code] ?? errorCatalog.apiError;
