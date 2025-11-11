import api from './api';
import type { Product, ProductsResponse, ProductFilters, ProductResponse, ProductsData } from '../types/product.types';

const normalizeProductsResponse = (response: ProductsResponse): ProductsData => {
  if (Array.isArray(response.data)) {
    return {
      products: response.data,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: response.data.length,
        itemsPerPage: response.data.length
      }
    };
  }
  return response.data as ProductsData;
};

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<ProductsData> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.supplier) params.append('supplier', filters.supplier);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get<ProductsResponse>(url);
    return normalizeProductsResponse(response.data);
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data.data;
  },

  searchProducts: async (searchTerm: string, page = 1, limit = 10): Promise<ProductsData> => {
    return productService.getProducts({
      search: searchTerm,
      page,
      limit,
      isActive: true
    });
  },

  getActiveProducts: async (page = 1, limit = 12): Promise<ProductsData> => {
    return productService.getProducts({
      page,
      limit,
      isActive: true
    });
  },

  getProductsByCategory: async (category: string, page = 1, limit = 12): Promise<ProductsData> => {
    return productService.getProducts({
      category,
      page,
      limit,
      isActive: true
    });
  }
};
