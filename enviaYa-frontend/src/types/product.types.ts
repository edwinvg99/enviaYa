export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
  category?: string;
  supplier?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  supplier?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ProductsData {
  products: Product[];
  pagination: PaginationInfo;
}

export interface ProductsResponse {
  success: boolean;
  message?: string;
  data: Product[] | ProductsData; // Puede ser array directo o con paginación
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}
