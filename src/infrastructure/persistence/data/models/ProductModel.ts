import { IProduct } from "../../../../domain/products/entities/Product";
import { Schema, model, Document } from 'mongoose';

export interface IProductModel extends Omit<IProduct, '_id'>, Document {}

const ProductSchema = new Schema<IProductModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String },
  isActive: { type: Boolean, default: true },
  isDiscontinued: { type: Boolean, default: false },
  supplier: { type: String },
  sku: { type: String, unique: true, sparse: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  }
}, {
  timestamps: true
});

export const ProductModel = model<IProductModel>("Product", ProductSchema);
