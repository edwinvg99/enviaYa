import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '../../../../domain/categories/entities/Category';

export interface ICategoryModel extends Omit<Category, '_id'>, Document {}

const CategorySchema = new Schema<ICategoryModel>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const CategoryModel = mongoose.model<ICategoryModel>('Category', CategorySchema);
