import type { Product } from './product.types';

export interface CartItem {
  productId: string | Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddToCartRequest {
  userId?: string;
  productId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  userId?: string;
  productId: string;
}

export interface CartResponse {
  success: boolean;
  status: number;
  message: string;
  data: Cart;
}
