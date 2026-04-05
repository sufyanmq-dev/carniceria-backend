// config/swagger.js
// Configuración de Swagger/OpenAPI 3.0 para CarniOrder API

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CarniOrder API",
      version: "2.0.0",
      description:
        "API REST de pedidos para Carnicería El Rincón. Autenticación con cookie JWT httpOnly.",
    },
    servers: [
      { url: "http://localhost:5001/api", description: "Desarrollo local" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "token" },
      },
      schemas: {
        // Respuesta de error estándar
        ErrorResponse: {
          type: "object",
          properties: {
            ok: { type: "boolean", example: false },
            code: { type: "string", example: "userNotFound" },
            message: { type: "string", example: "Usuario no encontrado" },
          },
        },
        // Entidades principales
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            username: { type: "string", example: "sufyan" },
            email: { type: "string", example: "sufyan@test.com" },
            phone: { type: "string", example: "612345678" },
            address: { type: "string", example: "Calle Mayor 1, Madrid" },
            role: { type: "string", enum: ["admin", "empleado", "cliente"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string", example: "Vacuno" },
            description: { type: "string", example: "Carne de vaca y ternera" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Chuletón de Ávila" },
            description: {
              type: "string",
              example: "Corte premium de vacuno mayor",
            },
            price: { type: "number", example: 28.5 },
            unit: { type: "string", enum: ["kg", "ud"], example: "kg" },
            is_active: { type: "boolean", example: true },
            category_id: { type: "integer", example: 1 },
            category: { type: "string", example: "Vacuno" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            status: {
              type: "string",
              enum: ["pendiente", "en_preparacion", "entregado", "cancelado"],
            },
            notes: { type: "string", example: "Sin hueso, corte fino" },
            total: { type: "number", example: 48.5 },
            client_name: { type: "string", example: "sufyan" },
            client_phone: { type: "string", example: "612345678" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            product_id: { type: "string", format: "uuid" },
            product_name: { type: "string", example: "Chuletón de Ávila" },
            quantity: { type: "number", example: 1.5 },
            unit: { type: "string", enum: ["kg", "ud"], example: "kg" },
            price_at_order: { type: "number", example: 28.5 },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // lee @swagger de rutas
};

export default swaggerJsdoc(options);
