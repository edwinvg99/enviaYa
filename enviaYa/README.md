# EnviaYa – Backend API y Frontend

Sistema completo de gestión de envíos, órdenes y productos. El repositorio incluye:

- Backend API (esta carpeta: `enviaYa`) con Node.js, TypeScript, Express y MongoDB
- Frontend SPA (carpeta hermana: `enviaYa-frontend`) con React + Vite + Tailwind CSS

## 🚀 Cómo ejecutar todo el proyecto (backend + frontend)

Requisitos previos:

- Node.js 18+ y npm
- Una base de datos MongoDB accesible (local o Atlas)

1. Backend (puerto 3000)

```bash
cd enviaYa
npm install
cp .env.example .env   # o crea el .env con los valores de abajo
npm run dev
```

2. Frontend (puerto 5173)

```bash
cd ../enviaYa-frontend
npm install
cp .env.example .env   # o crea el .env con los valores de abajo
npm run dev
```

URLs por defecto:

- API: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Frontend: [http://localhost:5173](http://localhost:5173)

## 📘 Documentación de API (Swagger)

La API expone documentación interactiva con Swagger/OpenAPI.

1. Arranca el backend (`npm run dev` en `enviaYa`)
2. Abre en el navegador: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Desde Swagger puedes:

- Explorar endpoints y modelos
- Probar peticiones desde el navegador
- Ver formatos de respuesta y códigos de estado

## ⚙️ Configuración de variables de entorno

### Backend (`enviaYa/.env`)

Ejemplo de `.env`:

```env
# Servidor
PORT=3000
BASE_URL=http://localhost:3000

# Base de datos
MONGO_URI=mongodb://localhost:27017/enviaYa

# Auth
JWT_SECRET=una_clave_segura_larga

# EmailJS (para verificación de correo)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

Notas:

- El backend, en entorno de desarrollo, utiliza headers personalizados para autenticación simple:
  - `x-user-id` y `x-user-role` (`USER` | `VENDOR` | `ADMIN`)
- Algunos flujos (registro/login) generan/verifican tokens JWT; ajusta `JWT_SECRET` y `BASE_URL` según tu entorno.

### Frontend (`enviaYa-frontend/.env`)

Ejemplo de `.env`:

```bash
VITE_API_URL=http://localhost:3000/api/v1
```text

Con esto, el frontend consumirá la API local y mostrará correctamente Swagger/recursos.


## 🧱 Estructura (Backend)

```text
src/
├── domain/              # Lógica de negocio
│   ├── entities/        # Entidades de dominio
│   ├── repositories/    # Puertos (interfaces)
│   └── services/        # Servicios de dominio
├── application/         # Casos de uso
├── infrastructure/      # Adaptadores (HTTP, Mongo, email)
│   ├── http/
│   ├── persistence/
│   └── email/
└── config/              # Configuración general
```

## 🔐 Autenticación y autorización (desarrollo)

Para endpoints protegidos, envía los headers:

```
x-user-id: <user_id>
x-user-role: <USER|VENDOR|ADMIN>
```

El frontend ya añade estos headers automáticamente a partir del usuario almacenado en `localStorage`.

## 📦 Scripts útiles (backend)

```bash
# Desarrollo con recarga
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar compilado
npm start
```

## 🧭 Reglas de negocio (resumen)

- Solo órdenes en estado PENDIENTE se pueden cancelar (stock se devuelve)
- Envíos avanzan por estados secuenciales; entregado requiere confirmación
- Notificaciones al usuario para eventos relevantes (p. ej., cancelación)

## 🧪 Formato estándar de respuestas de la API

Éxito:

```json
{
   "success": true,
   "status": 200,
   "message": "Operación exitosa",
   "data": {}
}
```

Error:

```json
{
   "success": false,
   "status": 400,
   "message": "Error en la operación",
   "error": "Detalles del error"
}
```
