import api from './api';
import type { Category, CategoryPayload } from '../types/category.types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
  return response.data.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get<{ success: boolean; data: Category }>(`/categories/${id}`);
  return response.data.data;
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const response = await api.post<{ success: boolean; data: Category }>('/categories', payload);
  return response.data.data;
};

export const updateCategory = async (id: string, payload: Partial<CategoryPayload>): Promise<Category> => {
  const response = await api.put<{ success: boolean; data: Category }>(`/categories/${id}`, payload);
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
