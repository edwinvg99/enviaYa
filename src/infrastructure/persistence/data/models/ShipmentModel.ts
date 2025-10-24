import mongoose, { Schema, Document } from 'mongoose';
import { Shipment, ShipmentHistory } from '../../../../domain/shipments/entities/Shipment';

export interface IShipmentModel extends Omit<Shipment, '_id'>, Document {}

const ShipmentHistorySchema = new Schema({
  status: { 
    type: String, 
    enum: ['PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_ENTREGA', 'ENTREGADO', 'DEVUELTO', 'CANCELADO', 'PERDIDO'],
    required: true
  },
  location: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ShipmentSchema = new Schema<IShipmentModel>({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  trackingNumber: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_ENTREGA', 'ENTREGADO', 'DEVUELTO', 'CANCELADO', 'PERDIDO'],
    default: 'PENDIENTE'
  },
  currentLocation: { type: String, required: true },
  estimatedDelivery: { type: Date, required: true },
  actualDelivery: { type: Date },
  history: [ShipmentHistorySchema],
  carrier: { type: String, required: true },
  carrierTrackingNumber: { type: String, unique: true, sparse: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  notes: { type: String }
}, {
  timestamps: true
});

export const ShipmentModel = mongoose.model<IShipmentModel>('Shipment', ShipmentSchema);
