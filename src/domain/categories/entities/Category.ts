// Entidad de dominio: Category
export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
