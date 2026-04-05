// Envuelve controllers async para pasar cualquier error a next().
// Evita repetir try/catch en cada función.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
