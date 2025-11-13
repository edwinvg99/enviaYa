import React from 'react';
import type { Product } from '../types/product.types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="group bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 overflow-hidden hover:shadow-sky-500/20 hover:shadow-2xl transition-all duration-300 border border-slate-700 hover:border-sky-500/50">
      {/* Imagen del producto */}
      <Link to={`/products/${product._id}`}>
        <div className="relative h-40 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badge de stock bajo */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg shadow-orange-500/30">
              ¡Pocas!
            </div>
          )}
          
          {/* Badge de sin stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-600">
                Agotado
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Información del producto */}
      <div className="p-3">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-bold text-slate-100 mb-1 hover:text-sky-400 transition-colors line-clamp-2 h-10">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-xs text-slate-400 mb-2 line-clamp-1">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
          <div>
            <p className="text-lg font-bold text-sky-400">{formatPrice(product.price)}</p>
            <p className="text-xs text-slate-500 flex items-center mt-0.5">
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {product.stock > 0 ? `${product.stock}` : '0'}
            </p>
          </div>
          
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              disabled={product.stock === 0}
              title={product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
              className={`flex items-center justify-center w-9 h-9 rounded-lg font-semibold transition-all duration-200 ${
                product.stock === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-600 text-white hover:bg-sky-500 hover:scale-110 active:scale-95 shadow-lg shadow-sky-600/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
