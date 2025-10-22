// Entidad de dominio: Product

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  image: string;
  isActive: boolean;
  isDiscontinued?: boolean;
  supplier?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

