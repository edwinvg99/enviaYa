import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { categoryService, type Category } from '../services/category.service';
import { cartService } from '../services/cart.service';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import type { Product } from '../types/product.types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: Record<string, string | number> = { page: currentPage, limit: 12 };
      
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category = selectedCategory;
      if (minPrice) filters.minPrice = parseFloat(minPrice);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
      
      const response = await productService.getProducts(filters);

      setProducts(response.products || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Debounce para búsqueda y filtros de precio
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, minPrice, maxPrice]);

  // Sin debounce para categoría y paginación (cambio inmediato)
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart({
        userId: user._id!,
        productId: product._id,
        quantity: 1
      });
      
      setSuccessMessage(`${product.name} agregado al carrito`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-6">Catálogo de Productos</h1>
          
          {/* Barra de búsqueda y filtros */}
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Fila 1: Búsqueda */}
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos por nombre..."
                className="flex-1 px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-slate-100 placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/30"
              >
                Buscar
              </button>
            </div>

            {/* Fila 2: Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro de categoría */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-slate-100"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de precio mínimo */}
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-slate-300 mb-1">
                  Precio mínimo
                </label>
                <input
                  id="minPrice"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="$0"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Filtro de precio máximo */}
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-slate-300 mb-1">
                  Precio máximo
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Sin límite"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Botón para limpiar filtros */}
            {(searchTerm || selectedCategory || minPrice || maxPrice) && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Alertas */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
          </div>
        )}

        {/* Grid de productos */}
        {!products || products.length === 0 ? (
          <EmptyState
            title="No hay productos disponibles"
            message="No se encontraron productos que coincidan con tu búsqueda."
            action={{
              label: 'Limpiar filtros',
              onClick: handleClearFilters
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <span className="text-slate-300 font-medium">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
