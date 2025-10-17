// Entidad de dominio: Product
export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  active: boolean;
  images: string[];
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}
