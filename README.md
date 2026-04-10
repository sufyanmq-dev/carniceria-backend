# CarniOrder — Backend

API REST para la gestión de pedidos de una carnicería. Desarrollada con Node.js y Express, con autenticación JWT y base de datos PostgreSQL.

---

## Stack

- Node.js + Express
- PostgreSQL (Supabase)
- Slonik (query builder)
- JWT con cookie httpOnly
- Bcrypt
- Helmet + CORS + Rate limiting
- Swagger / OpenAPI

---

## Estructura

```bash
src/
├── config/       # DB, JWT, CORS, seguridad, Swagger
├── controllers/  # Lógica de negocio
├── middleware/   # Autenticación, autorización, errores, rate limit
├── misc/         # Catálogo de errores tipados
├── models/       # Consultas a la base de datos
├── routes/       # Definición de endpoints
└── utils/        # Utilidades compartidas
migrations/       # Migraciones SQL ordenadas cronológicamente
```

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en Supabase con una base de datos PostgreSQL activa

---

## Instalación
```bash
git clone https://github.com/sufyanmq-dev/carniceria-backend.git
cd carniceria-backend
npm install
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_db
JWT_SECRET=tu_clave_secreta
FRONTEND_URL=http://localhost:5173
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que escucha el servidor |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) |
| `DATABASE_URL` | URL de conexión a PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `FRONTEND_URL` | URL del frontend permitida por CORS |

---

## Migraciones

Ejecuta las migraciones para crear las tablas en la base de datos:
```bash
npm run migrate
```

Las migraciones crean las siguientes tablas en orden: `roles`, `users`, `categories`, `products`, `orders`, `order_items`. El seed inicial inserta los tres roles del sistema: `admin`, `empleado` y `cliente`.

---

## Arrancar el servidor
```bash
npm run dev
```

- API disponible en: `http://localhost:5001`
- Documentación Swagger en: `http://localhost:5001/api/docs`

---

## Endpoints

Todos los endpoints tienen el prefijo `/api`:

| Recurso | Prefijo | Acceso |
|---|---|---|
| Autenticación | `/auth` | Público |
| Productos | `/products` | Autenticado |
| Categorías | `/categories` | Autenticado |
| Pedidos | `/orders` | Autenticado |
| Usuarios | `/users` | Autenticado |
| Roles | `/roles` | Admin |

La documentación completa con todos los parámetros y respuestas está disponible en `/api/docs`.

---

## Seguridad

- JWT almacenado en cookie httpOnly, inaccesible desde JavaScript
- Contraseñas cifradas con bcrypt
- Cabeceras HTTP configuradas con Helmet
- Rate limiting general y estricto en rutas de autenticación
- CORS restringido a `FRONTEND_URL` según el entorno
- Catálogo de errores tipados que evita exponer información interna

---

## Autor

Sufyan Mohammad Qandeel  
DAW — ThePower Business School — 2025/2026