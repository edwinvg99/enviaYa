// Entidad de dominio: Shipment
import { Address } from '../../shared/value-objects/Address';

export interface Shipment {
  _id?: string;
  orderId: string;
  userId: string;
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  history: ShipmentHistory[];
  carrier: string;
  carrierTrackingNumber?: string;
  shippingAddress: Address;
  deliveryConfirmation?: DeliveryConfirmation;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeliveryConfirmation {
  confirmedBy: 'CUSTOMER' | 'ADMIN';
  photoUrl?: string;
  signature?: string;
  confirmedAt: Date;
  notes?: string;
}

export interface ShipmentHistory {
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: Date | string;
}

export type ShipmentStatus = 
  | 'PENDIENTE'
  | 'PREPARANDO'
  | 'EN_TRANSITO'
  | 'EN_ENTREGA'
  | 'ENTREGADO'
  | 'DEVUELTO'
  | 'CANCELADO'
  | 'PERDIDO';
