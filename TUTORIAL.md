# TUTORIAL - Pruebas con Thunder Client

## Tabla de Contenido

1. [Usuarios](#usuarios)
2. [Categorías](#categorías)
3. [Proveedores](#proveedores)
4. [Productos](#productos)
5. [Órdenes](#órdenes)
6. [Envíos](#envíos)
7. [Notificaciones](#notificaciones)

---

## USUARIOS

### 1. Registrar Usuario

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/users/register`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
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

**Roles disponibles:** `USER`, `ADMIN`, `VENDOR`

---

### 2. Iniciar Sesión

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/users/login`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "email": "admin@enviaya.com",
  "password": "Admin123456"
}
```

---

## CATEGORÍAS

### 1. Crear Categoría (ADMIN)

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/categories`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "name": "Electrónica",
  "description": "Productos electrónicos y tecnológicos",
  "active": true
}
```

---

### 2. Listar Categorías (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/categories`

**Headers:** Ninguno requerido

---

### 3. Ver Categoría por ID (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/categories/CATEGORY_ID`

**Headers:** Ninguno requerido

---

### 4. Actualizar Categoría (ADMIN)

**Método:** `PUT`
**URL:** `http://localhost:3000/api/v1/categories/CATEGORY_ID`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "name": "Electrónica y Tecnología",
  "description": "Productos tecnológicos actualizados",
  "active": true
}
```

---

### 5. Eliminar Categoría (ADMIN)

**Método:** `DELETE`
**URL:** `http://localhost:3000/api/v1/categories/CATEGORY_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

⚠️ **No se puede eliminar si tiene productos asociados**

---

## PROVEEDORES

### 1. Crear Proveedor (ADMIN)

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/suppliers`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
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

### 2. Listar Proveedores (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/suppliers`

**Headers:** Ninguno requerido

---

### 3. Ver Proveedor por ID (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/suppliers/SUPPLIER_ID`

**Headers:** Ninguno requerido

---

### 4. Actualizar Proveedor (ADMIN)

**Método:** `PUT`
**URL:** `http://localhost:3000/api/v1/suppliers/SUPPLIER_ID`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "name": "TechSupply Colombia SAS",
  "email": "ventas@techsupply.com",
  "phone": "+573109876543",
  "contactPerson": "María Rodríguez",
  "isActive": true
}
```

---

### 5. Eliminar Proveedor (ADMIN)

**Método:** `DELETE`
**URL:** `http://localhost:3000/api/v1/suppliers/SUPPLIER_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

⚠️ **No se puede eliminar si tiene productos asociados**

---

## PRODUCTOS

### 1. Crear Producto (ADMIN)

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/products`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
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
  "category": "CATEGORY_ID",
  "supplier": "SUPPLIER_ID"
}
```

---

### 2. Listar Productos (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/products`

**Headers:** Ninguno requerido

**Query Params opcionales:**

- `page=1`
- `limit=10`
- `name=Laptop`
- `minPrice=1000000`
- `maxPrice=2000000`

---

### 3. Ver Producto por ID (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/products/PRODUCT_ID`

**Headers:** Ninguno requerido

---

### 4. Actualizar Producto (ADMIN)

**Método:** `PUT`
**URL:** `http://localhost:3000/api/v1/products/PRODUCT_ID`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "name": "Laptop Dell Inspiron 15 Plus",
  "description": "Laptop actualizada con 16GB RAM",
  "price": 1799000,
  "stock": 30,
  "isActive": true
}
```

---

### 5. Actualizar Stock (ADMIN/VENDOR)

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/products/PRODUCT_ID/stock`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body - Incrementar:**

```json
{
  "quantity": 10
}
```

**Body - Decrementar:**

```json
{
  "quantity": -5
}
```

---

### 6. Eliminar Producto (ADMIN)

**Método:** `DELETE`
**URL:** `http://localhost:3000/api/v1/products/PRODUCT_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

⚠️ **No se puede eliminar si tiene órdenes asociadas**

---

## ÓRDENES

### 1. Crear Orden

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/orders`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

**Body:**

```json
{
  "userId": "TU_USER_ID",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 2,
      "price": 1599000
    }
  ],
  "shippingAddress": {
    "street": "Calle 123 #45-67",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "zipCode": "110111",
    "country": "Colombia"
  },
  "totalAmount": 3198000
}
```

**Validaciones:**

- ✅ Usuario debe existir
- ✅ Productos deben existir
- ✅ Debe haber stock suficiente
- ✅ Stock se reduce automáticamente

---

### 2. Listar Todas las Órdenes (ADMIN)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/orders`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

---

### 3. Listar Órdenes Pendientes (ADMIN/VENDOR)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/orders/pending`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

---

### 4. Listar Órdenes por Estado (ADMIN/VENDOR)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/orders/status/PENDIENTE`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Estados disponibles:** `PENDIENTE`, `EN_PROCESO`, `ENVIADA`, `ENTREGADA`, `CANCELADA`

---

### 5. Ver Órdenes de un Usuario

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/orders/user/USER_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

---

### 6. Ver Orden por ID

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/orders/ORDER_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

---

### 7. Cancelar Orden

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/orders/ORDER_ID/cancel`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

**Body:**

```json
{
  "reason": "Cliente solicitó cancelación"
}
```

**Validaciones:**

- ✅ Solo órdenes en estado `PENDIENTE` pueden cancelarse
- ✅ Stock se devuelve automáticamente
- ✅ Se crea notificación al cliente
- ✅ Cambia estado a `CANCELADA`

---

### 8. Actualizar Estado de Orden (ADMIN/VENDOR)

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/orders/ORDER_ID/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body - Cambiar a PREPARANDO:**

```json
{
  "status": "PREPARANDO"
}
```

**Body - Cambiar a EN_TRANSITO:**

```json
{
  "status": "EN_TRANSITO"
}
```

**Body - Cambiar a EN_ENTREGA:**

```json
{
  "status": "EN_ENTREGA"
}
```

**Body - Cambiar a ENTREGADO:**

```json
{
  "status": "ENTREGADO"
}
```

**Transiciones Válidas:**

- `PENDIENTE` → `PREPARANDO` o `CANCELADO`
- `PREPARANDO` → `EN_TRANSITO` o `CANCELADO`
- `EN_TRANSITO` → `EN_ENTREGA` o `CANCELADO`
- `EN_ENTREGA` → `ENTREGADO` o `CANCELADO`
- `ENTREGADO` → (estado final)
- `CANCELADO` → (estado final)

**Validaciones:**

- ✅ Solo ADMIN o VENDOR pueden actualizar
- ✅ Transiciones secuenciales obligatorias
- ✅ No se puede cambiar desde ENTREGADO o CANCELADO
- ✅ Se crea notificación al cliente automáticamente

---

### 9. Procesar Cancelación Automática (ADMIN)

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/orders/process-auto-cancel`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Función:** Cancela automáticamente órdenes con más de 48 horas en estado PENDIENTE.

---

## ENVÍOS

### 1. Crear Envío (ADMIN/VENDOR)

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/shipments`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "orderId": "ORDER_ID"
}
```

**Validaciones:**

- ✅ La orden debe existir
- ✅ La orden debe estar en estado `PREPARANDO`
- ✅ No debe existir ya un envío para esa orden
- ✅ Genera tracking único: `TRK-YYYYMMDD-XXXXX`
- ✅ Cambia orden a `EN_TRANSITO`

---

### 2. Consultar Envío por Tracking (Público)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/shipments/tracking/TRK-20251022-12345`

**Headers:** Ninguno requerido

---

### 3. Listar Todos los Envíos (ADMIN/VENDOR)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/shipments`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

---

### 4. Listar Envíos por Estado (ADMIN/VENDOR)

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/shipments/status/EN_TRANSITO`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Estados disponibles:**

- `PENDIENTE`
- `PREPARANDO`
- `EN_TRANSITO`
- `EN_ENTREGA`
- `ENTREGADO`
- `DEVUELTO`
- `CANCELADO`
- `PERDIDO`

---

### 5. Ver Envío por ID

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/shipments/SHIPMENT_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

---

### 6. Actualizar Estado a PREPARANDO (ADMIN/VENDOR)

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/shipments/SHIPMENT_ID/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "status": "PREPARANDO",
  "location": "Centro de distribución Bogotá",
  "description": "Paquete en preparación",
  "carrierTrackingNumber": "CARRIER-001-2025"
}
```

---

### 7. Actualizar Estado a EN_TRANSITO (ADMIN/VENDOR)

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/shipments/SHIPMENT_ID/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "status": "EN_TRANSITO",
  "location": "En camino a Medellín",
  "description": "Paquete despachado"
}
```

---

### 8. Actualizar Estado a EN_ENTREGA (ADMIN/VENDOR)

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/shipments/SHIPMENT_ID/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "status": "EN_ENTREGA",
  "location": "Centro de distribución Medellín",
  "description": "En vehículo de reparto"
}
```

---

### 9. Actualizar Estado a ENTREGADO (ADMIN/VENDOR)

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/shipments/SHIPMENT_ID/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Body:**

```json
{
  "status": "ENTREGADO",
  "location": "Dirección del cliente",
  "description": "Entregado al cliente - Firmado por Juan Pérez"
}
```

---

### 10. Marcar Envíos Perdidos (ADMIN)

**Método:** `POST`
**URL:** `http://localhost:3000/api/v1/shipments/mark-overdue-lost`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "ADMIN"
}
```

**Función:** Marca como PERDIDO los envíos con más de 15 días sin entregar.

---

## NOTIFICACIONES

### 1. Listar Notificaciones del Usuario

**Método:** `GET`
**URL:** `http://localhost:3000/api/v1/notifications/user/USER_ID`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

---

### 2. Marcar Notificación como Leída

**Método:** `PATCH`
**URL:** `http://localhost:3000/api/v1/notifications/NOTIFICATION_ID/read`

**Headers:**

```json
{
  "x-user-id": "TU_USER_ID",
  "x-user-role": "USER"
}
```

---

## FLUJO COMPLETO DE PRUEBAS

### **Paso 1: Registrar Usuario ADMIN**

```
POST /users/register
```

### **Paso 2: Crear Categoría**

```
POST /categories
```

### **Paso 3: Crear Proveedor**

```
POST /suppliers
```

### **Paso 4: Crear Producto**

```
POST /products
```

### **Paso 5: Crear Orden**

```
POST /orders
```

### **Paso 6: Crear Envío**

```
POST /shipments
```

### **Paso 7: Actualizar Estados del Envío**

```
PATCH /shipments/:id/status
PENDIENTE → PREPARANDO → EN_TRANSITO → EN_ENTREGA → ENTREGADO
```

### **Paso 8: Cancelar Orden (opcional)**

```
PATCH /orders/:id/cancel
```

---

## REGLAS DE NEGOCIO IMPORTANTES

### Productos:

- ✅ Solo ADMIN puede crear/eliminar productos
- ✅ Stock no puede ser negativo
- ✅ No se puede eliminar si tiene órdenes asociadas

### Categorías:

- ✅ No se pueden eliminar si tienen productos activos

### Proveedores:

- ✅ No se pueden eliminar si tienen productos asociados
- ✅ Email y teléfono deben ser válidos

### Órdenes:

- ✅ Solo se cancelan órdenes PENDIENTE
- ✅ Stock se devuelve automáticamente al cancelar
- ✅ Notificación obligatoria al cancelar
- ✅ Auto-cancelación después de 48 horas
- ✅ Solo ADMIN/VENDOR pueden cambiar estado
- ✅ Transiciones de estado secuenciales obligatorias
- ✅ Estados finales: ENTREGADO y CANCELADO (no se pueden modificar)

### Envíos:

- ✅ Número de tracking único: `TRK-YYYYMMDD-XXXXX`
- ✅ Solo transiciones secuenciales de estados
- ✅ Número de guía de transportadora único
- ✅ Estado ENTREGADO requiere confirmación
- ✅ +15 días sin entregar = PERDIDO

---

## AUTENTICACIÓN

Para todas las rutas protegidas, incluye estos headers:

```json
{
  "x-user-id": "ID_DEL_USUARIO",
  "x-user-role": "ADMIN|VENDOR|USER"
}
```

**Roles:**

- `USER`: Usuario normal (puede crear órdenes, ver sus envíos)
- `VENDOR`: Vendedor (puede gestionar productos y envíos)
- `ADMIN`: Administrador (acceso completo)

---

## NOTAS IMPORTANTES

1. Reemplaza `TU_USER_ID` con el ID real del usuario registrado
2. Reemplaza `CATEGORY_ID`, `SUPPLIER_ID`, `PRODUCT_ID`, etc. con IDs reales
3. La URL base es `http://localhost:3000/api/v1`
4. El servidor debe estar corriendo: `npm run dev`
5. MongoDB debe estar conectado
