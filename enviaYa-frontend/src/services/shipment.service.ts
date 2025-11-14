import api from './api';
import type { Shipment, ApiResponse } from '../types/shipment.types';

const unwrap = <T,>(resp: { data: ApiResponse<T> }): T => resp.data.data;

export const shipmentService = {
  async getUserShipments(userId: string): Promise<Shipment[]> {
    return unwrap(await api.get<ApiResponse<Shipment[]>>(`/shipments/user/${userId}`));
  }
};
