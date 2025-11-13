export interface Category {
  _id?: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
  active: boolean;
}
