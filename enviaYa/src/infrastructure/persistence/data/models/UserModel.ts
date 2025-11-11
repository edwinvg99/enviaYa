import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from '../../../../domain/users/entities/User';

interface IUserDoc extends Document<Types.ObjectId, any, IUser> {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isVerified: boolean;
  verificationToken?: string | null;  
  role: 'USER' | 'ADMIN' | 'VENDOR' | 'SUPER_ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUserDoc {}

const UserSchema = new Schema<IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },

    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'VENDOR', 'SUPER_ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);


