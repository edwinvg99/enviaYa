import mongoose, { Schema, Document } from 'mongoose';
import { Supplier } from '../../../../domain/suppliers/entities/Supplier';

export interface ISupplierModel extends Omit<Supplier, '_id'>, Document {}

const SupplierSchema = new Schema<ISupplierModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  contactPerson: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const SupplierModel = mongoose.model<ISupplierModel>('Supplier', SupplierSchema);
