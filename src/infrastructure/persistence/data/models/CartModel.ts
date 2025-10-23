import { Schema, model, Document } from 'mongoose';
import { Cart } from '../../../../domain/cartUser/entities/Cart';

export interface CartDoc extends Omit<Cart, '_id'>, Document {}

// Items del carrito
const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 },
  addedAt: { type: Date, default: Date.now },
  priceLockedUntil: { type: Date, required: true } // precio congelado por 2h
});

// 🛒 Esquema principal del carrito
const CartSchema = new Schema<CartDoc>(
  {
    userId: { type: String, required: true },
    items: [CartItemSchema],
    total: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true }, // expira en 24h sin actividad
    lastActivity: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true }
);

// Middleware: recalcular totales automáticamente antes de guardar
CartSchema.pre('save', function (next) {
  const cart: any = this;
  cart.total = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
  cart.lastActivity = new Date();
  next();
});

export const CartModel = model<CartDoc>('Cart', CartSchema);
