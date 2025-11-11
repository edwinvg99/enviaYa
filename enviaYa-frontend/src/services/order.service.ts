import api from './api';
import type { 
  Order, 
  CreateOrderRequest, 
  OrdersResponse, 
  OrderResponse 
} from '../types/order.types';

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<OrderResponse>('/orders', data);
    return response.data.data;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await api.get<OrdersResponse>(`/orders/user/${userId}`);
    return response.data.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<OrderResponse>(`/orders/${orderId}`);
    return response.data.data;
  },

  cancelOrder: async (orderId: string, reason: string): Promise<Order> => {
    const response = await api.patch<OrderResponse>(`/orders/${orderId}/cancel`, { reason });
    return response.data.data;
  },

  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    const response = await api.get<OrdersResponse>(`/orders/status/${status}`);
    return response.data.data;
  }
};
