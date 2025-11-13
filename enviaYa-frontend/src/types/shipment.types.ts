export type ShipmentStatus =
  | 'PENDIENTE'
  | 'PREPARANDO'
  | 'EN_TRANSITO'
  | 'EN_ENTREGA'
  | 'ENTREGADO'
  | 'DEVUELTO'
  | 'CANCELADO'
  | 'PERDIDO';

export interface ShipmentHistory {
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: string | Date;
}

export interface DeliveryConfirmation {
  confirmedBy: 'CUSTOMER' | 'ADMIN';
  photoUrl?: string;
  signature?: string;
  confirmedAt?: Date;
  notes?: string;
}

export interface Shipment {
  _id?: string;
  orderId: string;
  userId: string;
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: string;
  estimatedDelivery: string | Date;
  actualDelivery?: string | Date;
  history: ShipmentHistory[];
  carrier: string;
  carrierTrackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  deliveryConfirmation?: DeliveryConfirmation;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateShipmentPayload {
  orderId: string;
  userId: string;
  trackingNumber: string;
  carrier: string;
  shippingAddress: Shipment['shippingAddress'];
  estimatedDelivery: string | Date;
  notes?: string;
}

export interface UpdateShipmentStatusPayload {
  status: ShipmentStatus;
  location: string;
  description: string;
  carrierTrackingNumber?: string;
  deliveryConfirmation?: {
    confirmedBy: 'CUSTOMER' | 'ADMIN';
    photoUrl?: string;
    signature?: string;
    notes?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
