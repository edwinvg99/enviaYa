import type { Address } from './user.types';

export type OrderStatus = 
  | 'PENDIENTE' 
  | 'PREPARANDO' 
  | 'EN_TRANSITO' 
  | 'EN_ENTREGA' 
  | 'ENTREGADO' 
  | 'CANCELADO';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  productId: string;
  quantity: number;
  name?: string;
  unitPrice: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateOrderRequest {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  status: number;
  message: string;
  data: Order[];
}

export interface OrderResponse {
  success: boolean;
  status: number;
  message: string;
  data: Order;
}
