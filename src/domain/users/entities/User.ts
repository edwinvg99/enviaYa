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
  name: string;
  email: string;
  password: string;
  isVerified?: boolean;          
 verificationToken?: string | null;
}


