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
    postalCode: string;
    country: string;
  };
  isVerified?: boolean;
  verificationToken?: string | null;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'USER' | 'ADMIN' | 'VENDOR';


