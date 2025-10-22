import { Schema, model, Types } from 'mongoose';
import { Order, OrderItem } from '../../../../domain/orders/entities/Order';

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
});

const OrderSchema = new Schema<Order>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_ENTREGA', 'ENTREGADO', 'CANCELADO'],
      default: 'PENDIENTE'
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: { type: String },
    paymentStatus: { 
      type: String, 
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING'
    },
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

export const OrderModel = model<Order>('Order', OrderSchema);
