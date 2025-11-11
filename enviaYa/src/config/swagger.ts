import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EnviaYa API',
      version: version,
      description: 'API REST completa para sistema de gestión de órdenes y envíos de EnviaYa',
    //   contact: {
    //     name: 'EnviaYa Support',
    //     email: 'support@enviaya.com',
    //   },
    //   license: {
    //     name: 'MIT',
    //     url: 'https://opensource.org/licenses/MIT',
    //   },
    // } 
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.enviaya.com/api/v1',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        UserAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'ID del usuario autenticado',
        },
        RoleAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-role',
          description: 'Rol del usuario (ADMIN, VENDOR, USER)',
        },
      },
      schemas: {
        Address: {
          type: 'object',
          required: ['street', 'city', 'state', 'postalCode'],
          properties: {
            street: { type: 'string', example: 'Calle 123 #45-67' },
            city: { type: 'string', example: 'Bogotá' },
            state: { type: 'string', example: 'Cundinamarca' },
            postalCode: { type: 'string', example: '110111' },
            country: { type: 'string', example: 'Colombia', description: 'País (opcional)' },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'juan@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123' },
            phone: { type: 'string', example: '+573001234567', pattern: '^\\+[1-9]\\d{1,14}$' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'VENDOR'], default: 'USER' },
            address: { $ref: '#/components/schemas/Address' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Electrónica' },
            description: { type: 'string', example: 'Productos electrónicos' },
            active: { type: 'boolean', default: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Supplier: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'TechSupply Colombia' },
            email: { type: 'string', format: 'email', example: 'contacto@techsupply.com' },
            phone: { type: 'string', example: '+573001234567', pattern: '^\\+[1-9]\\d{1,14}$' },
            address: { $ref: '#/components/schemas/Address' },
            contactPerson: { type: 'string', example: 'Juan Pérez' },
            isActive: { type: 'boolean', default: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'stock'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Laptop Dell Inspiron 15' },
            description: { type: 'string', example: 'Laptop con procesador Intel Core i5' },
            price: { type: 'number', example: 1599000 },
            stock: { type: 'integer', example: 25 },
            image: { type: 'string', example: 'https://ejemplo.com/laptop.jpg' },
            isActive: { type: 'boolean', default: true },
            category: { type: 'string', example: '507f1f77bcf86cd799439011' },
            supplier: { type: 'string', example: '507f1f77bcf86cd799439011' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CartItem: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '68fae423eb3243b443a26544' },
            quantity: { type: 'integer', example: 2, minimum: 1 },
            price: { type: 'number', example: 50000 },
          },
        },
        Cart: {
          type: 'object',
          required: ['userId', 'items'],
          properties: {
            userId: { type: 'string', example: '68fbb71c342850a1d57c4053' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            total: { type: 'number', example: 100000 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderItem: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            quantity: { type: 'integer', example: 2, minimum: 1 },
            unitPrice: { type: 'number', example: 1599000 },
            price: { type: 'number', example: 1599000 },
            subtotal: { type: 'number', example: 3198000 },
          },
        },
        Order: {
          type: 'object',
          required: ['userId', 'items', 'shippingAddress'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            orderNumber: { type: 'string', example: 'ORD-20251024-A1B2C' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            status: {
              type: 'string',
              enum: ['PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_ENTREGA', 'ENTREGADO', 'CANCELADO'],
              default: 'PENDIENTE',
            },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            subtotal: { type: 'number', example: 3198000 },
            shippingCost: { type: 'number', example: 10000 },
            total: { type: 'number', example: 3208000 },
            shippingAddress: { $ref: '#/components/schemas/Address' },
            paymentMethod: { type: 'string', example: 'CREDIT_CARD' },
            paymentStatus: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
              default: 'PENDING',
            },
            notes: { type: 'string', example: 'Entregar en la mañana' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ShipmentHistory: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_ENTREGA', 'ENTREGADO', 'DEVUELTO', 'CANCELADO', 'PERDIDO'],
            },
            location: { type: 'string', example: 'Centro de distribución Bogotá' },
            description: { type: 'string', example: 'Paquete en preparación' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        Shipment: {
          type: 'object',
          required: ['orderId'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            orderId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            trackingNumber: { type: 'string', example: 'TRK-20251024-12345' },
            status: {
              type: 'string',
              enum: ['PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_ENTREGA', 'ENTREGADO', 'DEVUELTO', 'CANCELADO', 'PERDIDO'],
              default: 'PENDIENTE',
            },
            currentLocation: { type: 'string', example: 'Centro de distribución' },
            estimatedDelivery: { type: 'string', format: 'date-time' },
            actualDelivery: { type: 'string', format: 'date-time' },
            history: {
              type: 'array',
              items: { $ref: '#/components/schemas/ShipmentHistory' },
            },
            carrier: { type: 'string', example: 'EnviaYa' },
            carrierTrackingNumber: { type: 'string', example: 'CARRIER-001-2025' },
            shippingAddress: { $ref: '#/components/schemas/Address' },
            notes: { type: 'string', example: 'Frágil - Manejar con cuidado' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            type: {
              type: 'string',
              enum: ['ORDER_STATUS', 'ORDER_CANCELLED', 'SHIPMENT_UPDATE', 'PROMOTION', 'SYSTEM', 'ALERT'],
            },
            title: { type: 'string', example: 'Actualización de Envío' },
            message: { type: 'string', example: 'Su envío ha sido despachado' },
            isRead: { type: 'boolean', default: false },
            relatedEntityId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            relatedEntityType: { type: 'string', example: 'shipment' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 400 },
                message: { type: 'string', example: 'Error message' },
                details: { type: 'object' },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operación exitosa' },
          },
        },
      },
    },
    tags: [
      { name: 'Users', description: 'Gestión de usuarios y autenticación' },
      { name: 'Categories', description: 'Gestión de categorías de productos' },
      { name: 'Suppliers', description: 'Gestión de proveedores' },
      { name: 'Products', description: 'Gestión de productos' },
      { name: 'Cart', description: 'Gestión del carrito de compras' },
      { name: 'Orders', description: 'Gestión de órdenes' },
      { name: 'Shipments', description: 'Gestión de envíos' },
      { name: 'Notifications', description: 'Gestión de notificaciones' },
      { name: 'Checkout', description: 'Proceso de checkout y confirmación de orden' },
    ],
  },
  apis: [
    './src/infrastructure/http/routes/*.ts',
    './src/infrastructure/http/controllers/*.ts',
    './src/infrastructure/http/docs/*.ts'
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
