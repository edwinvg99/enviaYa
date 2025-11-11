// Entidad de dominio: Order
// src/domain/orders/entities/Order.ts

import { Address } from '../../shared/value-objects/Address';

export interface Order {
  _id?: string;
  orderNumber: string;
  userId: string;

  status: OrderStatus;

  items: OrderItem[];

  // Totales
  subtotal?: number;
  shippingCost?: number;
  total?: number;

  // Envío
  shippingAddress: Address; // Puedes mantener Address como value object

  // Pago
  paymentMethod?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  // Nueva compatibilidad para checkout
  shippingMethod?: 'standard' | 'express';  // nuevo campo
  orderConfirmed?: boolean;                 // para marcar confirmación de pedido
  orderCreatedAt?: Date;                    // adicional a createdAt, si usas tracking

  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  name?: string;        // nuevo: nombre producto
  unitPrice?: number;
  price?: number;
  subtotal?: number;
}

export type OrderStatus =
  | 'PENDIENTE'
  | 'PREPARANDO'
  | 'EN_TRANSITO'
  | 'EN_ENTREGA'
  | 'ENTREGADO'
  | 'CANCELADO';

