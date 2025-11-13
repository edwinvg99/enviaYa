export interface SupplierAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: SupplierAddress;
  contactPerson: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierPayload {
  name: string;
  email: string;
  phone: string;
  address: SupplierAddress;
  contactPerson: string;
  isActive: boolean;
}
