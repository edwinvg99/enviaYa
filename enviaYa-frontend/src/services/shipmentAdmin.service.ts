import api from './api';
import type { Shipment, ShipmentStatus, CreateShipmentPayload, UpdateShipmentStatusPayload, ApiResponse } from '../types/shipment.types';

const unwrap = <T,>(resp: { data: ApiResponse<T> }): T => resp.data.data;

export const shipmentAdminService = {
  async getAllShipments(): Promise<Shipment[]> {
    return unwrap(await api.get<ApiResponse<Shipment[]>>('/shipments'));
  },
  async getShipmentsByStatus(status: ShipmentStatus): Promise<Shipment[]> {
    return unwrap(await api.get<ApiResponse<Shipment[]>>(`/shipments/status/${status}`));
  },
  async getShipmentById(id: string): Promise<Shipment> {
    return unwrap(await api.get<ApiResponse<Shipment>>(`/shipments/${id}`));
  },
  async getShipmentByTracking(trackingNumber: string): Promise<Shipment> {
    return unwrap(await api.get<ApiResponse<Shipment>>(`/shipments/tracking/${trackingNumber}`));
  },
  async createShipment(orderId: string): Promise<Shipment> {
    // Backend espera { orderId } en el body
    return unwrap(await api.post<ApiResponse<Shipment>>('/shipments', { orderId }));
  },
  async updateShipmentStatus(id: string, payload: UpdateShipmentStatusPayload): Promise<Shipment> {
    return unwrap(await api.patch<ApiResponse<Shipment>>(`/shipments/${id}/status`, payload));
  },
  async confirmDelivery(id: string, payload: { photoUrl?: string; signature?: string; notes?: string }): Promise<Shipment> {
    return unwrap(await api.post<ApiResponse<Shipment>>(`/shipments/${id}/confirm-delivery`, payload));
  },
  async markOverdueLost(): Promise<{ processed: number }> {
    return unwrap(await api.post<ApiResponse<{ processed: number }>>('/shipments/mark-overdue-lost'));
  }
};
