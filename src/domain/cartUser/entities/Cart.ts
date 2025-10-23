export interface CartItem {
  productId: string;
  name: string;
  price: number;             
  quantity: number;
  subtotal: number;           
  addedAt: Date;
  priceLockedUntil: Date;     
}

export interface Cart {
  _id?: string;              
  userId: string;
  items: CartItem[];
  total: number;
  expiresAt: Date;           
  lastActivity: Date;       
}




