# EnviaYa API - Sistema de Gestion de Envios

## Descripcion

API REST para sistema de gestion de envios y ordenes, implementando arquitectura hexagonal con TypeScript, Express y MongoDB. El sistema permite la gestion completa de productos, ordenes, envios y notificaciones con diferentes roles de usuario.

---

## Documentacion de la API

La API cuenta con documentacion interactiva completa utilizando Swagger/OpenAPI 3.0.

Para acceder a la documentacion interactiva y probar los endpoints:

1. Ejecuta el servidor: `npm run dev`
2. Abre en tu navegador: `http://localhost:3000/api-docs`

La interfaz de Swagger permite:
- Explorar todos los endpoints disponibles
- Ver esquemas de datos y validaciones
- Probar requests directamente desde el navegador
- Ver ejemplos de respuestas
- Consultar codigos de estado HTTP

---

## Tecnologias Utilizadas

- **Node.js** con **TypeScript**
- **Express.js** para el servidor web
- **MongoDB** con **Mongoose** para la base de datos
- **Arquitectura Hexagonal** (Clean Architecture)
- **Swagger/OpenAPI 3.0** para documentacion
- **EmailJS** para notificaciones por correo

---

## Instalacion y Uso

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Crear archivo `.env` con:

   ```env
   MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/enviaYa
   PORT=3000
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_PRIVATE_KEY=your_private_key
   ```

3. **Ejecutar en desarrollo:**

   ```bash
   npm run dev
   ```

4. **Compilar para produccion:**

   ```bash
   npm run build
   npm start
   ```

---

## Arquitectura del Proyecto

El proyecto sigue los principios de Clean Architecture (Arquitectura Hexagonal):

```
src/
├── domain/              # Logica de negocio pura
│   ├── entities/       # Entidades de dominio
│   ├── repositories/   # Interfaces de repositorios
│   └── services/       # Servicios de dominio
├── application/         # Casos de uso
│   └── use-cases/      # Logica de aplicacion
├── infrastructure/      # Implementaciones tecnicas
│   ├── http/           # Controladores y rutas
│   ├── persistence/    # Repositorios MongoDB
│   └── email/          # Servicio de email
└── config/             # Configuracion general
```

---

## Reglas de Negocio Implementadas

### Productos
- Solo administradores pueden crear/eliminar productos
- Producto no puede eliminarse si tiene ordenes asociadas
- Stock no puede ser negativo
- Cambios de precio no afectan ordenes ya procesadas

### Categorias
- Solo administradores pueden crear/eliminar categorias
- Categorias no pueden eliminarse si tienen productos activos

### Proveedores
- Solo administradores pueden crear/eliminar proveedores
- Proveedores no pueden eliminarse si tienen productos asociados

### Ordenes
- Solo ordenes en estado PENDIENTE pueden cancelarse
- Al cancelar, el stock se devuelve automaticamente
- Notificacion obligatoria al cliente por cancelaciones
- Orden cancelada despues de 48 horas sin procesamiento

### Envios
- Solo se puede avanzar al siguiente estado secuencial
- Numero de guia de transportadora debe ser unico
- Estado ENTREGADO requiere confirmacion del cliente
- Envios no entregados en 15 dias se marcan como "perdidos"

---

## Autenticacion y Autorizacion

El sistema implementa tres roles de usuario:

- **USER**: Usuario regular (puede crear ordenes, ver sus envios)
- **VENDOR**: Vendedor (puede actualizar stock, ver ordenes)
- **ADMIN**: Administrador (acceso completo al sistema)

Los endpoints protegidos requieren los siguientes headers:
```
x-user-id: <user_id>
x-user-role: <USER|VENDOR|ADMIN>
```

---

## Procesos Automaticos

### Cancelacion Automatica de Ordenes
- Las ordenes pendientes por mas de 48 horas se cancelan automaticamente
- El stock se devuelve automaticamente
- Se envia notificacion al cliente

### Marcado de Envios Perdidos
- Los envios no entregados en 15 dias se marcan como "perdidos"
- Se envia notificacion al cliente
- Se actualiza el historial del envio

---

## Formato de Respuestas

Todas las respuestas de la API siguen un formato estandarizado:

**Respuesta exitosa:**
```json
{
  "success": true,
  "status": 200,
  "message": "Operacion exitosa",
  "data": { }
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "status": 400,
  "message": "Error en la operacion",
  "error": "Detalles del error"
}
```

---

## Estados del Sistema

### Estados de Orden
- PENDIENTE: Orden creada, esperando procesamiento
- PREPARANDO: Orden en preparacion (maximo 2 dias laborales)
- EN_TRANSITO: Enviado, en camino al destino
- EN_ENTREGA: En vehiculo de reparto para entrega
- ENTREGADO: Confirmado recibido por el cliente
- CANCELADO: Orden cancelada por cliente o admin

### Estados de Envio
- PENDIENTE: Envio creado, esperando procesamiento
- PREPARANDO: En preparacion
- EN_TRANSITO: Enviado, en camino al destino
- EN_ENTREGA: En vehiculo de reparto para entrega
- ENTREGADO: Confirmado recibido por el cliente
- DEVUELTO: Devuelto al remitente
- CANCELADO: Envio cancelado
- PERDIDO: Envio perdido (despues de 15 dias)

---

## Licencia

Este proyecto es privado y de uso interno.
