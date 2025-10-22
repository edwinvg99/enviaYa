// Entidad de dominio: User
/*import { Address } from '../../shared/value-objects/Address';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: Address;
  emailVerified: boolean;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'USER' | 'ADMIN';*/
// src/domain/entities/User.ts
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isVerified?: boolean;
  verificationToken?: string | null;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'USER' | 'ADMIN' | 'VENDOR';


