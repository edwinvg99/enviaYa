// Entidad de dominio: Order
import { Address } from '../../shared/value-objects/Address';

export interface Order {
  _id?: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  shippingAddress: Address;
  paymentMethod?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
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
