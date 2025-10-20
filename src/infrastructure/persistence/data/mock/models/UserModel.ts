import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../../../../../domain/users/entities/User';


export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);

