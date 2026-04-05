// Helpers para enviar respuestas HTTP uniformes.

/** Envía respuesta exitosa { ok: true, ...data } */
export const sendSuccess = (res, data = {}, status = 200) =>
  res.status(status).json({ ok: true, ...data });

/** Envía respuesta de error { ok: false, code, message } */
export const sendError = (res, status, code, message) =>
  res.status(status).json({ ok: false, code, message });
