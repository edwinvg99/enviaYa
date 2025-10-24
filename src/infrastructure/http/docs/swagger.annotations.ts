/**
 * @swagger
 * components:
 *   securitySchemes:
 *     UserAuth:
 *       type: apiKey
 *       in: header
 *       name: x-user-id
 *       description: ID del usuario autenticado
 *     RoleAuth:
 *       type: apiKey
 *       in: header
 *       name: x-user-role
 *       description: Rol del usuario (ADMIN, VENDOR, USER)
 */

/**
 * USERS ROUTES
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin Test
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@enviaya.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Admin123456
 *               phone:
 *                 type: string
 *                 example: "+573001234567"
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, VENDOR]
 *                 default: USER
 *                 example: ADMIN
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: Calle 123 #45-67
 *                   city:
 *                     type: string
 *                     example: Bogotá
 *                   state:
 *                     type: string
 *                     example: Cundinamarca
 *                   postalCode:
 *                     type: string
 *                     example: 110111
 *                   country:
 *                     type: string
 *                     example: Colombia
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación o email ya existe
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y devuelve sus credenciales
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * SUPPLIERS ROUTES
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Listar todos los proveedores (Público)
 *     description: Obtiene lista de todos los proveedores sin necesidad de autenticación
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Lista de proveedores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 */

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Crear un nuevo proveedor (ADMIN)
 *     description: Crea un nuevo proveedor. Solo administradores pueden ejecutar esta acción.
 *     tags: [Suppliers]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: TechSupply Colombia
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contacto@techsupply.com
 *               phone:
 *                 type: string
 *                 example: "+573001234567"
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               contactPerson:
 *                 type: string
 *                 example: Juan Pérez
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Solo ADMIN puede crear proveedores
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Obtener proveedor por ID (Público)
 *     description: Obtiene los detalles de un proveedor específico
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Detalles del proveedor
 *       404:
 *         description: Proveedor no encontrado
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Actualizar un proveedor (ADMIN)
 *     description: Actualiza los datos de un proveedor existente
 *     tags: [Suppliers]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: TechSupply Colombia SAS
 *               email:
 *                 type: string
 *                 example: ventas@techsupply.com
 *               phone:
 *                 type: string
 *                 example: "+573109876543"
 *               contactPerson:
 *                 type: string
 *                 example: María Rodríguez
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Proveedor actualizado exitosamente
 *       403:
 *         description: Solo ADMIN puede actualizar proveedores
 *       404:
 *         description: Proveedor no encontrado
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Eliminar un proveedor (ADMIN)
 *     description: Elimina un proveedor. No se puede eliminar si tiene productos asociados.
 *     tags: [Suppliers]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proveedor eliminado exitosamente
 *       400:
 *         description: No se puede eliminar - tiene productos asociados
 *       403:
 *         description: Solo ADMIN puede eliminar proveedores
 *       404:
 *         description: Proveedor no encontrado
 */

/**
 * CATEGORIES ROUTES
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Listar todas las categorías (Público)
 *     description: Obtiene lista de todas las categorías activas sin necesidad de autenticación
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría (ADMIN)
 *     description: Crea una nueva categoría de productos. Solo administradores pueden ejecutar esta acción.
 *     tags: [Categories]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electrónica
 *                 description: Nombre de la categoría
 *               description:
 *                 type: string
 *                 example: Productos electrónicos y tecnológicos
 *                 description: Descripción de la categoría
 *               active:
 *                 type: boolean
 *                 default: true
 *                 description: Estado activo/inactivo de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error de validación o categoría ya existe
 *       403:
 *         description: Solo ADMIN puede crear categorías
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID (Público)
 *     description: Obtiene los detalles de una categoría específica sin necesidad de autenticación
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Detalles de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría (ADMIN)
 *     description: Actualiza los datos de una categoría existente. Solo administradores pueden ejecutar esta acción.
 *     tags: [Categories]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electrónica y Tecnología
 *                 description: Nuevo nombre de la categoría
 *               description:
 *                 type: string
 *                 example: Productos tecnológicos actualizados
 *                 description: Nueva descripción
 *               active:
 *                 type: boolean
 *                 example: true
 *                 description: Estado activo/inactivo
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Solo ADMIN puede actualizar categorías
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría (ADMIN)
 *     description: Elimina una categoría del sistema. No se puede eliminar si tiene productos asociados. Solo administradores pueden ejecutar esta acción.
 *     tags: [Categories]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Categoría eliminada exitosamente
 *       400:
 *         description: No se puede eliminar - tiene productos asociados
 *       403:
 *         description: Solo ADMIN puede eliminar categorías
 *       404:
 *         description: Categoría no encontrada
 */

/**
 * ORDERS ROUTES
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar todas las órdenes
 *     description: Obtiene lista paginada de todas las órdenes (requiere autenticación)
 *     tags: [Orders]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     description: Crea una orden con productos, calcula totales automáticamente y reduce stock
 *     tags: [Orders]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - shippingAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *               shippingAddress:
 *                 $ref: '#/components/schemas/Address'
 *               paymentMethod:
 *                 type: string
 *                 example: CREDIT_CARD
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Error al crear la orden (stock insuficiente, producto no encontrado, etc.)
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener orden por ID
 *     description: Obtiene los detalles completos de una orden específica
 *     tags: [Orders]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       404:
 *         description: Orden no encontrada
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Actualizar estado de una orden (ADMIN/VENDOR)
 *     description: Cambia el estado de una orden siguiendo transiciones secuenciales válidas
 *     tags: [Orders]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PREPARANDO, EN_TRANSITO, EN_ENTREGA, ENTREGADO, CANCELADO]
 *                 example: PREPARANDO
 *                 description: |
 *                   Transiciones válidas:
 *                   - PENDIENTE → PREPARANDO o CANCELADO
 *                   - PREPARANDO → EN_TRANSITO o CANCELADO
 *                   - EN_TRANSITO → EN_ENTREGA o CANCELADO
 *                   - EN_ENTREGA → ENTREGADO o CANCELADO
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Transición de estado inválida
 *       403:
 *         description: No autorizado (solo ADMIN/VENDOR)
 */

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar una orden
 *     description: Cancela una orden en estado PENDIENTE y devuelve el stock automáticamente
 *     tags: [Orders]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Cliente solicitó cancelación
 *     responses:
 *       200:
 *         description: Orden cancelada exitosamente
 *       400:
 *         description: Solo se pueden cancelar órdenes PENDIENTE
 */

/**
 * SHIPMENTS ROUTES
 */

/**
 * @swagger
 * /shipments:
 *   get:
 *     summary: Listar todos los envíos (ADMIN/VENDOR)
 *     description: Obtiene lista paginada de todos los envíos
 *     tags: [Shipments]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de envíos obtenida exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /shipments:
 *   post:
 *     summary: Crear un nuevo envío (ADMIN/VENDOR)
 *     description: Crea un envío para una orden en estado PREPARANDO y genera número de tracking único (formato TRK-YYYYMMDD-XXXXX). Automáticamente cambia la orden a estado EN_TRANSITO.
 *     tags: [Shipments]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: ID de la orden (debe estar en estado PREPARANDO)
 *     responses:
 *       201:
 *         description: Envío creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Shipment'
 *       400:
 *         description: La orden debe estar en estado PREPARANDO o ya existe un envío para esta orden
 *       403:
 *         description: Solo ADMIN/VENDOR pueden crear envíos
 */

/**
 * @swagger
 * /shipments/{id}:
 *   get:
 *     summary: Obtener envío por ID
 *     description: Obtiene los detalles completos de un envío incluyendo su historial
 *     tags: [Shipments]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del envío
 *     responses:
 *       200:
 *         description: Detalles del envío
 *       404:
 *         description: Envío no encontrado
 */

/**
 * @swagger
 * /shipments/tracking/{trackingNumber}:
 *   get:
 *     summary: Consultar envío por número de tracking (Público)
 *     description: Permite rastrear un envío usando su número de tracking sin necesidad de autenticación. Útil para que los clientes rastreen sus paquetes.
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: TRK-20251024-12345
 *         description: Número de tracking del envío
 *     responses:
 *       200:
 *         description: Información del envío con historial completo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Shipment'
 *       404:
 *         description: Envío no encontrado
 */

/**
 * @swagger
 * /shipments/status/{status}:
 *   get:
 *     summary: Listar envíos por estado (ADMIN/VENDOR)
 *     description: Obtiene lista de envíos filtrados por estado específico
 *     tags: [Shipments]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, PREPARANDO, EN_TRANSITO, EN_ENTREGA, ENTREGADO, DEVUELTO, CANCELADO, PERDIDO]
 *         description: Estado del envío
 *     responses:
 *       200:
 *         description: Lista de envíos por estado
 */

/**
 * @swagger
 * /shipments/{id}/status:
 *   patch:
 *     summary: Actualizar estado de un envío (ADMIN/VENDOR)
 *     description: |
 *       Actualiza el estado del envío siguiendo transiciones secuenciales válidas y agrega entrada al historial.
 *       
 *       **Transiciones válidas:**
 *       - PENDIENTE → PREPARANDO o CANCELADO
 *       - PREPARANDO → EN_TRANSITO o CANCELADO
 *       - EN_TRANSITO → EN_ENTREGA o CANCELADO
 *       - EN_ENTREGA → ENTREGADO, DEVUELTO o CANCELADO
 *       - ENTREGADO → (estado final)
 *       - DEVUELTO → EN_TRANSITO
 *       - CANCELADO → (estado final)
 *       - PERDIDO → (estado final)
 *     tags: [Shipments]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del envío
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - location
 *               - description
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PREPARANDO, EN_TRANSITO, EN_ENTREGA, ENTREGADO, DEVUELTO, CANCELADO]
 *                 example: EN_TRANSITO
 *               location:
 *                 type: string
 *                 example: Centro de distribución Bogotá
 *                 description: Ubicación actual del paquete
 *               description:
 *                 type: string
 *                 example: Paquete en tránsito hacia Medellín
 *                 description: Descripción del cambio de estado
 *               carrierTrackingNumber:
 *                 type: string
 *                 example: CARRIER-001-2025
 *                 description: Número de guía de la transportadora (opcional, debe ser único)
 *           examples:
 *             preparando:
 *               summary: Cambiar a PREPARANDO
 *               value:
 *                 status: PREPARANDO
 *                 location: Centro de distribución Bogotá
 *                 description: Paquete en preparación
 *                 carrierTrackingNumber: CARRIER-001-2025
 *             en_transito:
 *               summary: Cambiar a EN_TRANSITO
 *               value:
 *                 status: EN_TRANSITO
 *                 location: En camino a Medellín
 *                 description: Paquete despachado
 *             en_entrega:
 *               summary: Cambiar a EN_ENTREGA
 *               value:
 *                 status: EN_ENTREGA
 *                 location: Centro de distribución Medellín
 *                 description: En vehículo de reparto
 *             entregado:
 *               summary: Cambiar a ENTREGADO
 *               value:
 *                 status: ENTREGADO
 *                 location: Dirección del cliente
 *                 description: Entregado al cliente - Firmado por Juan Pérez
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente y notificación enviada al usuario
 *       400:
 *         description: Transición de estado inválida o número de guía duplicado
 *       403:
 *         description: Solo ADMIN/VENDOR pueden actualizar estados de envío
 */

/**
 * @swagger
 * /shipments/mark-overdue-lost:
 *   post:
 *     summary: Marcar envíos vencidos como perdidos (ADMIN)
 *     description: Procesa automáticamente todos los envíos con más de 15 días sin entregar y los marca como PERDIDOS. Envía notificaciones a los usuarios afectados.
 *     tags: [Shipments]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     responses:
 *       200:
 *         description: Proceso completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: integer
 *                   description: Cantidad de envíos marcados como perdidos
 *                 message:
 *                   type: string
 *                   example: Se marcaron 3 envíos como perdidos
 *       403:
 *         description: Solo ADMIN puede ejecutar esta operación
 */

/**
 * PRODUCTS ROUTES
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar productos (Público)
 *     description: Obtiene lista paginada de productos con filtros opcionales. No requiere autenticación.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de productos por página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Buscar por nombre del producto
 *         example: Laptop
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *         example: 1000000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *         example: 2000000
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto (ADMIN)
 *     description: Crea un nuevo producto en el catálogo. Solo administradores pueden ejecutar esta acción.
 *     tags: [Products]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Dell Inspiron 15
 *               description:
 *                 type: string
 *                 example: Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD
 *               price:
 *                 type: number
 *                 example: 1599000
 *                 description: Precio en pesos colombianos
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 25
 *                 description: Cantidad disponible en inventario
 *               image:
 *                 type: string
 *                 example: https://ejemplo.com/laptop.jpg
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: ID de la categoría
 *               supplier:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: ID del proveedor
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Solo ADMIN puede crear productos
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por ID (Público)
 *     description: Obtiene los detalles completos de un producto específico
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Detalles del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto (ADMIN)
 *     description: Actualiza los datos de un producto existente
 *     tags: [Products]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Dell Inspiron 15 Plus
 *               description:
 *                 type: string
 *                 example: Laptop actualizada con 16GB RAM
 *               price:
 *                 type: number
 *                 example: 1799000
 *               stock:
 *                 type: integer
 *                 example: 30
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       403:
 *         description: Solo ADMIN puede actualizar productos
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Actualizar stock de un producto (ADMIN/VENDOR)
 *     description: Incrementa o decrementa el stock de un producto
 *     tags: [Products]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 10
 *                 description: Cantidad a incrementar (positivo) o decrementar (negativo)
 *           examples:
 *             incrementar:
 *               summary: Incrementar stock
 *               value:
 *                 quantity: 10
 *             decrementar:
 *               summary: Decrementar stock
 *               value:
 *                 quantity: -5
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
 *       400:
 *         description: Stock insuficiente para decrementar
 *       403:
 *         description: Solo ADMIN/VENDOR pueden actualizar stock
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto (ADMIN)
 *     description: Elimina un producto del catálogo. No se puede eliminar si tiene órdenes asociadas.
 *     tags: [Products]
 *     security:
 *       - UserAuth: []
 *       - RoleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       400:
 *         description: No se puede eliminar - tiene órdenes asociadas
 *       403:
 *         description: Solo ADMIN puede eliminar productos
 *       404:
 *         description: Producto no encontrado
 */

/**
 * CART ROUTES
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Añadir producto al carrito
 *     description: Agrega un producto al carrito del usuario o actualiza la cantidad si ya existe
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario (temporal, se obtendrá de autenticación)
 *                 example: 68fbb71c342850a1d57c4053
 *               productId:
 *                 type: string
 *                 description: ID del producto a agregar
 *                 example: 68fae423eb3243b443a26544
 *               quantity:
 *                 type: number
 *                 description: Cantidad del producto
 *                 example: 2
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Producto agregado al carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener carrito del usuario
 *     description: Retorna el carrito de compras del usuario con todos los productos
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID del usuario (temporal, se obtendrá de autenticación)
 *         example: 68fbb71c342850a1d57c4053
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Error al obtener carrito
 */

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remover producto del carrito
 *     description: Elimina un producto específico del carrito del usuario
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario (temporal, se obtendrá de autenticación)
 *                 example: 68fbb71c342850a1d57c4053
 *               productId:
 *                 type: string
 *                 description: ID del producto a eliminar
 *                 example: 68fae423eb3243b443a26544
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Error al eliminar producto
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Vaciar carrito completo
 *     description: Elimina todos los productos del carrito del usuario
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario (temporal, se obtendrá de autenticación)
 *                 example: 68fbb71c342850a1d57c4053
 *     responses:
 *       200:
 *         description: Carrito vaciado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Carrito vaciado
 *       500:
 *         description: Error al vaciar carrito
 */

/**
 * CHECKOUT ROUTES
 */

/**
 * @swagger
 * /checkout/confirm:
 *   post:
 *     summary: Confirmar checkout y crear orden
 *     description: Convierte el carrito en una orden, descuenta stock, limpia carrito y envía email de confirmación
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - shippingData
 *               - paymentMethod
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               shippingData:
 *                 $ref: '#/components/schemas/Address'
 *               paymentMethod:
 *                 type: string
 *                 example: CREDIT_CARD
 *                 enum: [CREDIT_CARD, DEBIT_CARD, PSE, CASH_ON_DELIVERY]
 *     responses:
 *       201:
 *         description: Checkout completado exitosamente
 *       400:
 *         description: Carrito vacío, stock insuficiente o datos inválidos
 */

/**
 * NOTIFICATIONS ROUTES
 */

/**
 * @swagger
 * /notifications/user/{userId}:
 *   get:
 *     summary: Obtener notificaciones de un usuario
 *     description: Lista todas las notificaciones del usuario ordenadas por fecha
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marcar notificación como leída
 *     description: Cambia el estado de una notificación a leída
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       404:
 *         description: Notificación no encontrada
 */

export {};
