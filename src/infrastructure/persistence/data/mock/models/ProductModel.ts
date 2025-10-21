import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  isActive: boolean;
  isDiscontinued: boolean;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String },
  isActive: { type: Boolean, default: true },
  isDiscontinued: { type: Boolean, default: false },
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);




