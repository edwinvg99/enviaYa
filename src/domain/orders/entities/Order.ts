// Entidad de dominio: Order
import { Address } from '../../shared/value-objects/Address';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  shippingAddress: Address;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: number;
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
