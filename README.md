# 📦 EnviaYa API - Sistema de Gestión de Envíos

## Descripción

API completa para el sistema de gestión de envíos EnviaYa, implementando el flujo completo de administrador/vendedor con todas las reglas de negocio especificadas.

---

## GUÍA DE PRUEBAS COMPLETA

### Prerequisitos

- Node.js instalado
- MongoDB corriendo
- El servidor ejecutándose: `npm run dev`
- **URL Base:** `http://localhost:3000/api/v1`

---

## FLUJO DE PRUEBAS PASO A PASO

### **REGISTRAR UN USUARIO ADMINISTRADOR**

**Endpoint:** `POST /api/v1/users/register`

**Método:** `POST`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Admin Test",
  "email": "admin@enviaya.com",
  "password": "Admin123456",
  "phone": "+573001234567",
  "role": "ADMIN",
  "address": {
    "street": "Calle 123 #45-67",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postalCode": "110111"
  }
}
```

**Respuesta Exitosa:**

```json
{
  "message": "Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.",
  "user": {
    "_id": "67890abcdef123456",
    "name": "Admin Test",
    "email": "admin@enviaya.com",
    "role": "ADMIN"
  }
}
```

---

### **CREAR UNA CATEGORÍA**

**Endpoint:** `POST /api/v1/categories`

**Método:** `POST`

**Headers:**

```
Content-Type: application/json
x-user-id: 
x-user-role: ADMIN
```

**Body:**

```json
{
  "name": "Electrónica",
  "description": "Productos electrónicos y tecnológicos",
  "active": true
}
```

**Respuesta Exitosa:**

```json
{
  "success": true,
  "data": {
    "statusCode": 201,
    "message": "Categoría creada exitosamente",
    "data": {
      "_id": "cat123456789",
      "name": "Electrónica",
      "description": "Productos electrónicos y tecnológicos"
    }
  }
}
```

---

### **CREAR UN PROVEEDOR**

**Endpoint:** `POST /api/v1/suppliers`

**Método:** `POST`

**Headers:**

```
Content-Type: application/json
x-user-id: 
x-user-role: ADMIN
```

**Body:**

```json
{
  "name": "TechSupply Colombia",
  "email": "contacto@techsupply.com",
  "phone": "+573001234567",
  "address": {
    "street": "Av. Cra 15 #100-50",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "zipCode": "110111",
    "country": "Colombia"
  },
  "contactPerson": "Juan Pérez",
  "isActive": true
}
```

---

### **CREAR UN PRODUCTO**

**Endpoint:** `POST /api/v1/products`

**Método:** `POST`

**Headers:**

```
Content-Type: application/json
x-user-id: 
x-user-role: ADMIN
```

**Body:**

```json
{
  "name": "Laptop Dell Inspiron 15",
  "description": "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
  "price": 1599000,
  "stock": 25,
  "image": "https://ejemplo.com/laptop.jpg",
  "isActive": true,
  "category": "cat123456789",
  "supplier": "sup123456789"
}
```

---

### **LISTAR PRODUCTOS (Sin Autenticación)**

**Endpoint:** `GET /api/v1/products`

**Método:** `GET`

**Headers:** (No requiere)

**Query Parameters (Opcionales):**

- `page=1`
- `limit=10`
- `name=Laptop`
- `minPrice=1000000`
- `maxPrice=2000000`

---

### **ACTUALIZAR STOCK**

**Endpoint:** `PATCH /api/v1/products/:id/stock`

**Método:** `PATCH`

**Headers:**

```
Content-Type: application/json
x-user-id: 
x-user-role: ADMIN
```

**Body:**

```json
{
  "quantity": 10
}
```

---

### **PROBAR REGLAS DE NEGOCIO**

#### **A) Intentar eliminar categoría con productos:**

**Endpoint:** `DELETE /api/v1/categories/:id`

**Método:** `DELETE`

**Headers:**

```
x-user-id: 
x-user-role: ADMIN
```

**Respuesta Esperada (Error):**

```json
{
  "success": false,
  "error": {
    "message": "No se puede eliminar una categoría que tiene productos activos"
  }
}
```

---

## TABLA DE ENDPOINTS DISPONIBLES

### **USUARIOS**

| Método | Endpoint            | Auth | Rol | Descripción      |
| ------- | ------------------- | ---- | --- | ----------------- |
| POST    | `/users/register` | ❌   | -   | Registrar usuario |
| POST    | `/users/login`    | ❌   | -   | Iniciar sesión   |
| GET     | `/users/verify`   | ❌   | -   | Verificar email   |

### **PRODUCTOS**

| Método | Endpoint                | Auth | Rol          | Descripción        |
| ------- | ----------------------- | ---- | ------------ | ------------------- |
| GET     | `/products`           | ❌   | -            | Listar productos    |
| GET     | `/products/:id`       | ❌   | -            | Ver producto        |
| POST    | `/products`           | ✅   | ADMIN        | Crear producto      |
| PUT     | `/products/:id`       | ✅   | ADMIN        | Actualizar producto |
| DELETE  | `/products/:id`       | ✅   | ADMIN        | Eliminar producto   |
| PATCH   | `/products/:id/stock` | ✅   | ADMIN/VENDOR | Actualizar stock    |

### **CATEGORÍAS**

| Método | Endpoint            | Auth | Rol   | Descripción          |
| ------- | ------------------- | ---- | ----- | --------------------- |
| GET     | `/categories`     | ❌   | -     | Listar categorías    |
| GET     | `/categories/:id` | ❌   | -     | Ver categoría        |
| POST    | `/categories`     | ✅   | ADMIN | Crear categoría      |
| PUT     | `/categories/:id` | ✅   | ADMIN | Actualizar categoría |
| DELETE  | `/categories/:id` | ✅   | ADMIN | Eliminar categoría   |

### **PROVEEDORES**

| Método | Endpoint           | Auth | Rol   | Descripción         |
| ------- | ------------------ | ---- | ----- | -------------------- |
| GET     | `/suppliers`     | ❌   | -     | Listar proveedores   |
| GET     | `/suppliers/:id` | ❌   | -     | Ver proveedor        |
| POST    | `/suppliers`     | ✅   | ADMIN | Crear proveedor      |
| PUT     | `/suppliers/:id` | ✅   | ADMIN | Actualizar proveedor |
| DELETE  | `/suppliers/:id` | ✅   | ADMIN | Eliminar proveedor   |

---

## REGLAS DE NEGOCIO (Probadas)

✅ **Solo ADMIN puede crear/eliminar productos**
✅ **Producto no puede eliminarse si tiene órdenes asociadas**
✅ **Stock no puede ser negativo**
✅ **Cambios de precio no afectan órdenes procesadas**
✅ **Categorías no pueden eliminarse si tienen productos activos**
✅ **Proveedores no pueden eliminarse si tienen productos asociados**

---

## Tecnologías Utilizadas

- **Node.js** con **TypeScript**
- **Express.js** para el servidor web
- **MongoDB** con **Mongoose** para la base de datos
- **Arquitectura Hexagonal** (Clean Architecture)

## Endpoints de la API

### Usuarios

- `GET /api/v1/users` - Obtener usuarios
- `POST /api/v1/users/register` - Registrar usuario
- `POST /api/v1/users/login` - Iniciar sesión
- `GET /api/v1/users/verify` - Verificar email

### Productos

- `GET /api/v1/products` - Obtener productos (con filtros)
- `GET /api/v1/products/:id` - Obtener producto por ID
- `POST /api/v1/products` - Crear producto (solo ADMIN)
- `PUT /api/v1/products/:id` - Actualizar producto (solo ADMIN)
- `DELETE /api/v1/products/:id` - Eliminar producto (solo ADMIN)
- `PATCH /api/v1/products/:id/stock` - Actualizar stock (ADMIN/VENDOR)

### Categorías

- `GET /api/v1/categories` - Obtener categorías
- `GET /api/v1/categories/:id` - Obtener categoría por ID
- `POST /api/v1/categories` - Crear categoría (solo ADMIN)
- `PUT /api/v1/categories/:id` - Actualizar categoría (solo ADMIN)
- `DELETE /api/v1/categories/:id` - Eliminar categoría (solo ADMIN)

### Proveedores

- `GET /api/v1/suppliers` - Obtener proveedores
- `GET /api/v1/suppliers/:id` - Obtener proveedor por ID
- `POST /api/v1/suppliers` - Crear proveedor (solo ADMIN)
- `PUT /api/v1/suppliers/:id` - Actualizar proveedor (solo ADMIN)
- `DELETE /api/v1/suppliers/:id` - Eliminar proveedor (solo ADMIN)

### Órdenes

- `GET /api/v1/orders` - Obtener órdenes (con filtros)
- `GET /api/v1/orders/pending` - Obtener órdenes pendientes
- `GET /api/v1/orders/status/:status` - Obtener órdenes por estado
- `GET /api/v1/orders/user/:userId` - Obtener órdenes del usuario
- `GET /api/v1/orders/:id` - Obtener orden por ID
- `POST /api/v1/orders` - Crear orden
- `PATCH /api/v1/orders/:id/cancel` - Cancelar orden
- `POST /api/v1/orders/process-auto-cancel` - Procesar cancelación automática

### Envíos

- `GET /api/v1/shipments` - Obtener envíos (con filtros)
- `GET /api/v1/shipments/status/:status` - Obtener envíos por estado
- `GET /api/v1/shipments/user/:userId` - Obtener envíos del usuario
- `GET /api/v1/shipments/tracking/:trackingNumber` - Obtener envío por tracking
- `GET /api/v1/shipments/:id` - Obtener envío por ID
- `POST /api/v1/shipments` - Crear envío
- `PATCH /api/v1/shipments/:id/status` - Actualizar estado de envío
- `POST /api/v1/shipments/mark-overdue-lost` - Marcar envíos vencidos como perdidos

### Notificaciones

- `GET /api/v1/notifications/user/:userId` - Obtener notificaciones del usuario
- `PATCH /api/v1/notifications/:id/read` - Marcar notificación como leída
- `PATCH /api/v1/notifications/user/:userId/read-all` - Marcar todas como leídas
- `DELETE /api/v1/notifications/:id` - Eliminar notificación

## Estados de las Entidades

### Estados de Orden

- `PENDIENTE` - Orden creada, esperando procesamiento
- `PREPARANDO` - Orden en preparación (máximo 2 días laborales)
- `EN_TRANSITO` - Enviado, en camino al destino
- `EN_ENTREGA` - En vehículo de reparto para entrega
- `ENTREGADO` - Confirmado recibido por el cliente
- `CANCELADO` - Orden cancelada por cliente o admin

### Estados de Envío

- `PENDIENTE` - Envío creado, esperando procesamiento
- `PREPARANDO` - En preparación
- `EN_TRANSITO` - Enviado, en camino al destino
- `EN_ENTREGA` - En vehículo de reparto para entrega
- `ENTREGADO` - Confirmado recibido por el cliente
- `DEVUELTO` - Devuelto al remitente
- `CANCELADO` - Envío cancelado
- `PERDIDO` - Envío perdido (después de 15 días)

## Instalación y Uso

1. **Instalar dependencias:**

   ```bash
   npm install
   ```
2. **Configurar variables de entorno:**
   Crear archivo `.env` con:

   ```
   MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/enviaYa
   PORT=3000
   ```
3. **Ejecutar en desarrollo:**

   ```bash
   npm run dev
   ```
4. **Compilar para producción:**

   ```bash
   npm run build
   npm start
   ```

## Reglas de Negocio Implementadas

### Productos

- Solo administradores pueden crear/eliminar productos
- Producto no puede eliminarse si tiene órdenes asociadas
- Stock no puede ser negativo
- Cambios de precio no afectan órdenes ya procesadas

### Categorías

- Solo administradores pueden crear/eliminar categorías
- Categorías no pueden eliminarse si tienen productos activos

### Órdenes

- Solo órdenes en estado PENDIENTE pueden cancelarse
- Al cancelar, el stock se devuelve automáticamente
- Notificación obligatoria al cliente por cancelaciones
- Orden cancelada después de 48 horas sin procesamiento

### Envíos

- Solo se puede avanzar al siguiente estado secuencial
- Número de guía de transportadora debe ser único
- Estado ENTREGADO requiere confirmación del cliente o foto
- Envíos no entregados en 15 días se marcan como "perdidos"

## Autenticación y Autorización

El sistema implementa tres roles de usuario:

- `USER` - Usuario regular (puede crear órdenes, ver sus envíos)
- `VENDOR` - Vendedor (puede actualizar stock, ver órdenes)
- `ADMIN` - Administrador (acceso completo al sistema)

## Notificaciones Automáticas

El sistema genera notificaciones automáticas para:

- Creación de órdenes
- Cancelación de órdenes
- Actualizaciones de estado de envío
- Envíos perdidos
- Cancelaciones automáticas por tiempo

## Procesos Automáticos

### Cancelación Automática de Órdenes

- Las órdenes pendientes por más de 48 horas se cancelan automáticamente
- El stock se devuelve automáticamente
- Se envía notificación al cliente

### Marcado de Envíos Perdidos

- Los envíos no entregados en 15 días se marcan como "perdidos"
- Se envía notificación al cliente
- Se actualiza el historial del envío

## Formato de Respuestas

Todas las respuestas siguen el formato:

```json
{
  "success": true,
  "status": 200,
  "message": "Operación exitosa",
  "data": { ... }
}
```

Para errores:

```json
{
  "success": false,
  "status": 400,
  "message": "Error en la operación",
  "error": "Detalles del error"
}
```
