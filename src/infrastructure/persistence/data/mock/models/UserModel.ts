import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../../../../../domain/users/entities/User';


export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
 verificationToken: { type: String }

});

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);

