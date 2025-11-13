import api from './api';
import type { Order, OrderStatus } from '../types/order.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getPendingOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>('/orders/pending');
  return response.data.data;
};

export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>(`/orders/status/${status}`);
  return response.data.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>('/orders');
  return response.data.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
};

export const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
  await api.patch(`/orders/${orderId}/cancel`, { reason });
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
  return response.data.data;
};

export const processAutoCancelOrders = async (): Promise<number> => {
  const response = await api.post<ApiResponse<number>>('/orders/process-auto-cancel');
  return response.data.data;
};

export const orderAdminService = {
  getPendingOrders,
  getOrdersByStatus,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  processAutoCancelOrders
};
