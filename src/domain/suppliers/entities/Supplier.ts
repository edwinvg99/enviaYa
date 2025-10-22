// Entidad de dominio: Supplier
export interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
