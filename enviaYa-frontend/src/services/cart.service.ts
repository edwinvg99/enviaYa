import api from './api';
import type { Cart, AddToCartRequest, RemoveFromCartRequest } from '../types/cart.types';

export const cartService = {
  getCart: async (userId: string): Promise<Cart> => {
    try {
      const response = await api.get<Cart>(`/cart?userId=${userId}`);
      if (!response.data) {
        return {
          userId,
          items: [],
          total: 0
        };
      }
      return response.data;
    } catch {
      return {
        userId,
        items: [],
        total: 0
      };
    }
  },

  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/add', data);
    return response.data;
  },

  removeFromCart: async (data: RemoveFromCartRequest): Promise<Cart> => {
    const response = await api.delete<Cart>('/cart/remove', { data });
    return response.data;
  },

  clearCart: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/cart/clear', {
      data: { userId }
    });
    return response.data;
  },

  updateQuantity: async (userId: string, productId: string, quantity: number): Promise<Cart> => {
    if (quantity <= 0) {
      return cartService.removeFromCart({ userId, productId });
    }
    
    await cartService.removeFromCart({ userId, productId });
    
    return cartService.addToCart({ userId, productId, quantity });
  }
};
