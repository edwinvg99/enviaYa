// Entidad de dominio: Category
export interface Category {
  _id?: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
