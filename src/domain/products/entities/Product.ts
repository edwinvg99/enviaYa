// Entidad de dominio: Product
export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  image: string;
  isActive: boolean;
  isDiscontinued?: boolean;
}

