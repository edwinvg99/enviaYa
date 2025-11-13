import api from './api';
import type { Supplier, SupplierPayload } from '../types/supplier.types';

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<{ success: boolean; data: Supplier[] }>('/suppliers');
  return response.data.data;
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  const response = await api.get<{ success: boolean; data: Supplier }>(`/suppliers/${id}`);
  return response.data.data;
};

export const createSupplier = async (payload: SupplierPayload): Promise<Supplier> => {
  const response = await api.post<{ success: boolean; data: Supplier }>('/suppliers', payload);
  return response.data.data;
};

export const updateSupplier = async (id: string, payload: Partial<SupplierPayload>): Promise<Supplier> => {
  const response = await api.put<{ success: boolean; data: Supplier }>(`/suppliers/${id}`, payload);
  return response.data.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};

export const supplierService = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
