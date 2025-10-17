# EnviaYa
Documentación técnica del backend de la aplicación de envíos **Enviaya**.
## Descripción
API REST desarrollada en **TypeScript** que expone endpoints para usuarios, productos, órdenes, envíos, categorías y notificaciones. Los nombres de variables, rutas y modelos se mantienen tal como están en el código fuente.
## Requisitos e instalación
```bash
# instalar dependencias
npm install
# modo desarrollo
npm run dev
# compilar
npm run build
# iniciar (producción)
npm start+
```
Revisar `package.json` para scripts y dependencias.
## Formato de respuestas
Todas las respuestas exitosas usan la siguiente estructura:
```json
{
  "success": true,
  "data": <cualquier>,
  "message": "opcional"
}
```
Erorres usan:
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
## Autenticación
La API en esta versión _mock_ usa datos de ejemplo en `src/data/mock` y no implementa tokens JWT activos en todos los endpoints. Revisar `src/middlewares` y controladores si se desea añadir protección por autenticación.
## Endpoints
A continuación se listan los endpoints principales. Se muestran parámetros (path/query/body), códigos HTTP manejados y ejemplos de request/response.
### Usuarios (`/api/users`)
- `POST /api/users/register` — Registrar usuario.
  - Body (ejemplo):
```json
{
  "id": 2,
  "email": "usuario@test.com",
  "password": "$2a$10$xdMjOrcYUgHtBYyTsHyOAefSyDTEoUNGSTXbfDdKh2bdveEqn5rqa",
  "name": "Usuario Test",
  "phone": "+573109876543",
  "address": {
    "street": "Carrera 70 #35-10",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postalCode": "110111"
  },
  "emailVerified": true,
  "role": "USER",
  "createdAt": "2025-02-01T00:00:00.000Z",
  "updatedAt": "2025-02-01T00:00:00.000Z"
}
```
  - Respuestas:
    - `201 Created` — Usuario creado. Devuelve el usuario (sin password en la respuesta).
    - `400 Bad Request` — Validación.
    - `409 Conflict` — Email ya registrado.
  - Ejemplo (respuesta 201):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "usuario@test.com",
    "password": "$2a$10$xdMjOrcYUgHtBYyTsHyOAefSyDTEoUNGSTXbfDdKh2bdveEqn5rqa",
    "name": "Usuario Test",
    "phone": "+573109876543",
    "address": {
      "street": "Carrera 70 #35-10",
      "city": "Bogotá",
      "state": "Cundinamarca",
      "postalCode": "110111"
    },
    "emailVerified": true,
    "role": "USER",
    "createdAt": "2025-02-01T00:00:00.000Z",
    "updatedAt": "2025-02-01T00:00:00.000Z"
  }
}
```
- `POST /api/users/login` — Login de usuario.
  - Body: `{ "email": "...", "password": "..." }`
  - Respuestas:
    - `200 OK` — Login exitoso (puede devolver token en implementación real).
    - `401 Unauthorized` — Credenciales inválidas.
- `GET /api/users` — Listar usuarios.
  - Query: opcional `?limit=&page=`.
  - `200 OK` — Lista de usuarios.
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "admin@enviaya.com",
      "password": "$2a$10$iZQ.KIt9Os/OSxOZt2sNyuTXE9SdPFrh1BB.L7XNuXw/3VWAHZdbe",
      "name": "Admin EnviaYa",
      "phone": "+573001234567",
      "address": {
        "street": "Calle 50 #45-30",
        "city": "Medellín",
        "state": "Antioquia",
        "postalCode": "050001"
      },
      "emailVerified": true,
      "role": "ADMIN",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "email": "usuario@test.com",
      "password": "$2a$10$xdMjOrcYUgHtBYyTsHyOAefSyDTEoUNGSTXbfDdKh2bdveEqn5rqa",
      "name": "Usuario Test",
      "phone": "+573109876543",
      "address": {
        "street": "Carrera 70 #35-10",
        "city": "Bogotá",
        "state": "Cundinamarca",
        "postalCode": "110111"
      },
      "emailVerified": true,
      "role": "USER",
      "createdAt": "2025-02-01T00:00:00.000Z",
      "updatedAt": "2025-02-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "email": "usuario@example.com",
      "password": "$2a$10$HWKUokVL3faHbFWpkx17euVuPSYVmY0QWfiB0VN8QPlX6CXU3X7Tq",
      "name": "Nombre Usuario",
      "phone": "+573001234567",
      "address": {
        "street": "Calle 123 #45-67",
        "city": "Medellín",
        "state": "Antioquia",
        "postalCode": "050001"
      },
      "emailVerified": false,
      "role": "USER",
      "createdAt": "2025-10-14T23:51:03.568Z",
      "updatedAt": "2025-10-14T23:51:03.568Z"
    }
  ]
}
```
- `GET /api/users/:id` — Obtener usuario por id.
  - Path: `id` (number).
  - `200 OK` — Usuario.
  - `404 Not Found` — Usuario no encontrado.
### Productos (`/api/products`)
- `POST /api/products` — Crear producto.
  - Body (ejemplo):
```json
{
  "id": 1,
  "name": "Laptop HP Pavilion",
  "sku": "LAP-HP-001",
  "description": "Laptop HP Pavilion 15 pulgadas, Intel i5, 8GB RAM",
  "price": 2500000,
  "stock": 15,
  "categoryId": 1,
  "active": true,
  "images": [
    "https://example.com/laptop1.jpg"
  ],
  "weight": 2.5,
  "createdAt": "2025-01-15T00:00:00.000Z",
  "updatedAt": "2025-01-15T00:00:00.000Z"
}
```
  - Códigos: `201 Created`, `400 Bad Request`, `409 Conflict` (SKU repetido).
- `GET /api/products` — Listar productos.
    - Query: `?categoryId=&active=&q=&limit=&page=`.
  - `200 OK` — Lista.
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop HP Pavilion",
      "sku": "LAP-HP-001",
      "description": "Laptop HP Pavilion 15 pulgadas, Intel i5, 8GB RAM",
      "price": 2500000,
      "stock": 15,
      "categoryId": 1,
      "active": true,
      "images": [
        "https://example.com/laptop1.jpg"
      ],
      "weight": 2.5,
      "createdAt": "2025-01-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Mouse Logitech MX Master 3",
      "sku": "MOUSE-LG-003",
      "description": "Mouse inalámbrico ergonómico de alta precisión",
      "price": 350000,
      "stock": 50,
      "categoryId": 2,
      "active": true,
      "images": [
        "https://example.com/mouse1.jpg"
      ],
      "weight": 0.3,
      "createdAt": "2025-01-20T00:00:00.000Z",
      "updatedAt": "2025-01-20T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Teclado Mecánico RGB edwin",
      "sku": "TEC-MEC-001",
      "description": "Teclado mecánico gaming con iluminación RGB",
      "price": 450000,
      "stock": 30,
      "categoryId": 2,
      "active": true,
      "images": [
        "https://example.com/teclado1.jpg"
      ],
      "weight": 1.2,
      "createdAt": "2025-10-14T19:19:45.407Z",
      "updatedAt": "2025-10-14T19:19:45.407Z"
    }
  ]
}
```
- `GET /api/products/:id` — Obtener producto por id.
### Categorías (`/api/categories`)
- `GET /api/categories` — Listar categorías.
  - Ejemplo respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Computadores",
      "description": "Laptops, desktops y accesorios",
      "active": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Accesorios",
      "description": "Periféricos y accesorios tecnológicos",
      "active": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```
- `GET /api/categories/:id` — Obtener categoría por id.
### Órdenes (`/api/orders`)
- `POST /api/orders` — Crear orden.
  - Body (ejemplo):
```json
{
  "id": 1,
  "orderNumber": "ORD-20251014-94949",
  "status": "PENDIENTE",
  "userId": 2,
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "unitPrice": 2500000
    },
    {
      "productId": 2,
      "quantity": 2,
      "unitPrice": 350000
    }
  ],
  "shippingAddress": {
    "street": "Carrera 70 #35-10",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postalCode": "110111"
  },
  "paymentMethod": "credit_card",
  "createdAt": "2025-10-14T20:23:16.838Z",
  "updatedAt": "2025-10-14T20:25:08.005Z"
}
```
  - Códigos: `201 Created`, `422 Unprocessable Entity` (datos inválidos), `404 Not Found` (producto/usuario no existe).
- `GET /api/orders` — Listar órdenes (opcional `?userId=`)
    - Ejemplo respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20251014-94949",
      "status": "PENDIENTE",
      "userId": 2,
      "items": [
        {
          "productId": 1,
          "quantity": 1,
          "unitPrice": 2500000
        },
        {
          "productId": 2,
          "quantity": 2,
          "unitPrice": 350000
        }
      ],
      "shippingAddress": {
        "street": "Carrera 70 #35-10",
        "city": "Bogotá",
        "state": "Cundinamarca",
        "postalCode": "110111"
      },
      "paymentMethod": "credit_card",
      "createdAt": "2025-10-14T20:23:16.838Z",
      "updatedAt": "2025-10-14T20:25:08.005Z"
    },
    {
      "id": 2,
      "orderNumber": "ORD-20251014-93633",
      "status": "CANCELADO",
      "items": [
        {
          "price": 2500000,
          "quantity": 2,
          "productId": 1
        }
      ],
      "shippingAddress": {
        "city": "Bogotá",
        "street": "Carrera 70 #35-10",
        "state": "Cundinamarca",
        "postalCode": "110111"
      },
      "userId": 1,
      "createdAt": "2025-10-14T21:32:01.409Z",
      "updatedAt": "2025-10-14T21:32:01.418Z"
    }
  ]
}
```
- `GET /api/orders/:id` — Obtener orden por id.
- `PUT /api/orders/:id/cancel` — Cancelar orden (cambia status a `CANCELADO`).
  ### Envíos (`/api/shipments`)
- `GET /api/shipments` — Listar envíos. Query opcional `?userId=&status=`.
    - Ejemplo respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "userId": 2,
      "trackingNumber": "TRK-20251010-54321",
      "status": "EN_ENTREGA",
      "currentLocation": "Centro de Distribución Bogotá",
      "estimatedDelivery": "2025-10-20T00:00:00.000Z",
      "history": [
        {
          "status": "PENDIENTE",
          "location": "Medellín",
          "description": "Paquete recibido en origen",
          "timestamp": "2025-10-10T10:00:00.000Z"
        },
        {
          "status": "EN_TRANSITO",
          "location": "Centro de Distribución Bogotá",
          "description": "Paquete en tránsito",
          "timestamp": "2025-10-12T15:30:00.000Z"
        },
        {
          "status": "EN_TRANSITO",
          "timestamp": "2025-10-14T21:33:41.819Z"
        },
        {
          "status": "EN_TRANSITO",
          "timestamp": "2025-10-14T21:33:50.805Z"
        },
        {
          "status": "EN_ENTREGA",
          "location": "Repartidor en ruta 83",
          "description": "Salió para entrega del local",
          "timestamp": "2025-10-14T22:37:33.746Z"
        }
      ],
      "carrier": "EnviaYa Express",
      "shippingAddress": {
        "street": "Carrera 70 #35-10",
        "city": "Bogotá",
        "state": "Cundinamarca",
        "postalCode": "110111"
      },
      "createdAt": "2025-10-10T10:00:00.000Z",
      "updatedAt": "2025-10-14T22:37:33.746Z"
    },
    {
      "id": 2,
      "orderId": 2,
      "userId": 1,
      "trackingNumber": "TRK-20251011-12345",
      "status": "ENTREGADO",
      "currentLocation": "Destinatario",
      "estimatedDelivery": "2025-10-15T00:00:00.000Z",
      "history": [
        {
          "status": "PENDIENTE",
          "location": "Cali",
          "description": "Paquete recibido en origen",
          "timestamp": "2025-10-11T09:00:00.000Z"
        },
        {
          "status": "EN_TRANSITO",
          "location": "Centro de Distribución",
          "description": "En camino",
          "timestamp": "2025-10-12T10:00:00.000Z"
        },
        {
          "status": "EN_ENTREGA",
          "location": "Repartidor en ruta",
          "description": "Salió para entrega",
          "timestamp": "2025-10-14T08:00:00.000Z"
        },
        {
          "status": "ENTREGADO",
          "location": "Destinatario",
          "description": "Entregado exitosamente",
          "timestamp": "2025-10-14T14:30:00.000Z"
        }
      ],
      "carrier": "EnviaYa Express",
      "shippingAddress": {
        "street": "Calle 50 #45-30",
        "city": "Medellín",
        "state": "Antioquia",
        "postalCode": "050001"
      },
      "createdAt": "2025-10-11T09:00:00.000Z",
      "updatedAt": "2025-10-14T14:30:00.000Z"
    }
  ]
}
```
- `GET /api/shipments/tracking/:trackingNumber` — Buscar envío por número de tracking.
- `GET /api/shipments/:id` — Obtener envío por id.
  - `PUT /api/shipments/:id/status` — Actualizar estado del envío.
  - Body ejemplo: `{ "status": "EN_TRANSITO", "location": "Centro de distribución...", "description": "..." }`
  - Códigos: `200 OK`, `422 Unprocessable Entity`, `404 Not Found`.
### Notificaciones (`/api/notifications`)
- `GET /api/notifications` — Listar notificaciones. Query opcional `?userId=`.
- `GET /api/notifications/:id` — Obtener notificación por id.
  - `PUT /api/notifications/:id/read` — Marcar como leída.
## Modelos de datos (TypeScript)

### `Order.ts`
```ts
import { Address } from './User';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 
  | 'PENDIENTE' 
  | 'PREPARANDO' 
  | 'EN_TRANSITO' 
  | 'EN_ENTREGA' 
  | 'ENTREGADO' 
  | 'CANCELADO';
```
### `Product.ts`
```ts
export interface Product {
    id: number;
    name: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    active: boolean;
    images: string[];
    weight: number;
    createdAt: Date;
    updatedAt: Date;
  }
```

### `User.ts`
```ts
export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: Address;
    emailVerified: boolean;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  }
```
## Códigos HTTP usados por controladores
- `200 OK` — Respuesta exitosa genérica.
- `201 Created` — Recurso creado.
- `400 Bad Request` — Validación o parámetros inválidos.
- `401 Unauthorized` — Credenciales inválidas.
- `404 Not Found` — Recurso no encontrado.
- `409 Conflict` — Conflicto (ej. email o sku duplicado).
- `422 Unprocessable Entity` — Datos semánticamente inválidos.
- `500 Internal Server Error` — Error del servidor.
