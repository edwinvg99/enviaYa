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
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  }
  