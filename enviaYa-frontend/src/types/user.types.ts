export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'VENDOR';

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  isVerified?: boolean;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}
