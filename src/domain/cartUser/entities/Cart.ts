export interface CartItem {
  productId: string;
  name: string;
  price: number;              // Precio congelado
  quantity: number;
  subtotal: number;           // 👈 NUEVO: subtotal por producto
  addedAt: Date;
  priceLockedUntil: Date;     // +2 horas desde que se agrega o actualiza
}

export interface Cart {
  _id?: string;               // ⚙️ Soporte para MongoDB
  userId: string;
  items: CartItem[];
  total: number;
  expiresAt: Date;            // +24h sin actividad
  lastActivity: Date;         // 📆 Actualizado en cada cambio
}




