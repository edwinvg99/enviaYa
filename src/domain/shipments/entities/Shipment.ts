// Entidad de dominio: Shipment
import { Address } from '../../shared/value-objects/Address';

export interface Shipment {
  id: number;
  orderId: number;
  userId: number;
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: string;
  estimatedDelivery: Date;
  history: ShipmentHistory[];
  carrier: string;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentHistory {
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: Date | string;
}

export type ShipmentStatus = 
  | 'PENDIENTE'
  | 'EN_TRANSITO'
  | 'EN_ENTREGA'
  | 'ENTREGADO'
  | 'DEVUELTO'
  | 'CANCELADO';
