
# EnviaYa API

API REST desarrollada en **TypeScript** con **Express** que implementa **Arquitectura Hexagonal** combinada con **Screaming Architecture** para gestionar usuarios, productos, órdenes, envíos, categorías y notificaciones.

## Instalación y scripts

```bash
npm install      # instalar dependencias
npm run dev      # modo desarrollo (nodemon + ts-node)
npm run build    # compilar a JavaScript
npm start        # ejecutar la versión compilada
```

## Configuración básica

- **Base URL:** `http://localhost:3000/api/v1/`
- **Health check:** `GET /health`

## Formato de respuestas

Todas las respuestas exitosas usan la siguiente estructura:

```json
{
  "success": true,
  "data": <cualquier>,
  "message": "opcional"
}
```

Errores usan:

```json
{
  "success": false,
  "error": {
    "code": <código_http>,
    "message": "descripción",
    "details": <opcional>
  }
}
```

## Códigos HTTP

- `200 OK` — Respuesta exitosa genérica.
- `201 Created` — Recurso creado.
- `400 Bad Request` — Validación o parámetros inválidos.
- `401 Unauthorized` — Credenciales inválidas.
- `404 Not Found` — Recurso no encontrado.
- `409 Conflict` — Conflicto (ej. email o sku duplicado).
- `422 Unprocessable Entity` — Datos semánticamente inválidos.
- `500 Internal Server Error` — Error del servidor.

## Autenticación

### Credenciales de prueba

| Rol   | Email                 | Password      |
| ----- | --------------------- | ------------- |
| Admin | `admin@enviaya.com` | `Admin123!` |

## Endpoints

### Usuarios (`/api/v1/users/`)

#### `POST /api/v1/users/register` — Registrar usuario

- **Body (ejemplo):**

```json
{
  "email": "usuario@test.com",
  "password": "Usuario_123",
  "name": "Usuario test",
  "phone": "+573003334567",
  "address": {
    "street": "Calle 123 #45-67",
    "city": "Medellín",
    "state": "Antioquia",
    "postalCode": "050001"
  }
}
```

- **Respuestas:**
  - `201 Created` — Usuario creado. Devuelve el usuario (sin password en la respuesta).
  - `400 Bad Request` — Validación.
  - `409 Conflict` — Email ya registrado.

#### `POST /api/v1/users/login` — Login de usuario

- **Body:** `{ "email": "...", "password": "..." }`
- **Respuestas:**
  - `200 OK` — Login exitoso (puede devolver token en implementación real).
  - `401 Unauthorized` — Credenciales inválidas.

#### `GET /api/v1/users` — Listar usuarios

- **Query:** opcional `?limit=&page=`
- **Respuesta:** `200 OK` — Lista de usuarios.

#### `GET /api/v1/users/:id` — Obtener usuario por id

- **Path:** `id` (number)
- **Respuestas:**
  - `200 OK` — Usuario.
  - `404 Not Found` — Usuario no encontrado.

---

### Productos (`/api/v1/products/`)

#### `POST /api/v1/products/` — Crear producto

- **Body (ejemplo):**

```json
{
  "name": "silla gamer KLP",
  "sku": "SILL-KLP-004",
  "description": "Silla gamer",
  "price": 800000,
  "stock": 18,
  "categoryId": 1,
  "active": true,
  "images": [
    "https://example.com/laptop1.jpg"
  ],
  "weight": 2.5
}
```

- **Respuestas:**
  - `201 Created` — Producto creado.
  - `400 Bad Request` — Validación.
  - `409 Conflict` — SKU repetido.

#### `GET /api/v1/products` — Listar productos

- **Respuesta:**`200 OK` — Lista de productos.

#### `GET /api/v1/products/:id` — Obtener producto por id

- **Respuesta:** `200 OK` — Producto.

---

### Categorías (`/api/v1/categories/`)

#### `GET /api/v1/categories` — Listar categorías

- **Respuesta:** `200 OK` — Lista de categorías.

#### `GET /api/v1/categories/:id` — Obtener categoría por id

- **Respuesta:** `200 OK` — Categoría.

---

### Órdenes (`/api/v1/orders/`)

#### `POST /api/v1/orders` — Crear orden

- **Body (ejemplo):**

```json
{
  "userId": 2,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 2500000
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 350000
    }
  ],
  "shippingAddress": {
    "street": "Carrera 70 #35-10",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postalCode": "110111"
  }
}
```

- **Respuestas:**
  - `201 Created` — Orden creada.
  - `422 Unprocessable Entity` — Datos inválidos.
  - `404 Not Found` — Producto/usuario no existe.

#### `GET /api/v1/orders` — Listar órdenes

- **Query:** opcional `?userId=`
- **Respuesta:** `200 OK` — Lista de órdenes.

#### `GET /api/v1/orders/:id` — Obtener orden por id

- **Respuesta:** `200 OK` — Orden.

#### `PUT /api/v1/orders/:id/cancel` — Cancelar orden

- Solo se pueden cancelar órdenes en estado `PENDIENTE`
- **Respuesta:** `200 OK` — Orden cancelada.

**Estados de orden:**

- `PENDIENTE`
- `CONFIRMADO`
- `EN_PROCESO`
- `EN_TRANSITO`
- `ENTREGADO`
- `CANCELADO`

---

### Envíos (`/api/v1/shipments/`)

#### `GET /api/v1/shipments` — Listar envíos

- **Query:** opcional `?userId=&status=`
- **Respuesta:** `200 OK` — Lista de envíos con historial completo.

#### `GET /api/v1/shipments/tracking/:trackingNumber` — Buscar por número de seguimiento

- **Respuesta:** `200 OK` — Envío.

#### `GET /api/v1/shipments/:id` — Obtener envío por id

- **Respuesta:** `200 OK` — Envío.

#### `PUT /api/v1/shipments/:id/status` — Actualizar estado del envío

- **Body (ejemplo):** `{ "status": "EN_TRANSITO", "location": "Centro de distribución...", "description": "..." }`
- **Respuestas:**
  - `200 OK` — Envío actualizado.
  - `422 Unprocessable Entity` — Datos inválidos.
  - `404 Not Found` — Envío no encontrado.

---

### Notificaciones (`/api/v1/notifications/`)

#### `GET /api/v1/notifications` — Listar notificaciones

- **Query:** opcional `?userId=`
- **Respuesta:** `200 OK` — Lista de notificaciones.

#### `GET /api/v1/notifications/:id` — Obtener notificación por id

- **Respuesta:** `200 OK` — Notificación.

#### `PUT /api/v1/notifications/:id/read` — Marcar como leída

- **Respuesta:** `200 OK` — Notificación marcada como leída.

---

## Estructura del Proyecto

```text
src/
├── domain/              # Núcleo del negocio (entidades, interfaces, value objects)
├── application/         # Casos de uso y servicios de aplicación
├── infrastructure/      # Adaptadores (HTTP, persistencia, configuración)
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middlewares/
│   └── persistence/
│       └── data/mock/   # Fuente de datos en JSON para desarrollo
└── shared/              # Utilidades y tipos compartidos
```
