import React from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem as CartItemType } from "../types/cart.types";

interface CartItemComponentProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating: boolean;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}) => {
  const navigate = useNavigate();
  
  const productId =
    typeof item.productId === "string" ? item.productId : item.productId._id;

  // Usar datos del item directamente (vienen del backend)
  const productName = item.name || "Producto";
  const productImage = item.image;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = item.price * item.quantity;

  const handleItemClick = () => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="flex gap-4 p-4 bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 hover:border-sky-500/50 transition-all">
      {/* Imagen del producto - Clickeable */}
      <div 
        onClick={handleItemClick}
        className="w-24 h-24 shrink-0 bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-sky-500/50 transition-all"
      >
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Información del producto - Clickeable */}
      <div className="flex-1 flex flex-col justify-between">
        <div onClick={handleItemClick} className="cursor-pointer">
          <h3 className="font-semibold text-slate-100 hover:text-sky-400 transition-colors">{productName}</h3>{" "}
          <p className="text-sm text-slate-400">{formatPrice(item.price)} c/u</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Control de cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(productId, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-200"
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold text-slate-100">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(productId, item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-200"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-bold text-lg text-sky-400">
              {formatPrice(subtotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => onRemove(productId)}
        disabled={isUpdating}
        className="text-red-400 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50"
        aria-label="Eliminar producto"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default CartItemComponent;
