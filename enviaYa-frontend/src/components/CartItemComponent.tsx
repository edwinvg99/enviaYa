import React from "react";
import type { CartItem as CartItemType } from "../types/cart.types";
import type { Product } from "../types/product.types";

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
  const productId =
    typeof item.productId === "string" ? item.productId : item.productId._id;

  // Usar los datos que vienen directamente del item
  const productName = (item as any).name || "Producto";
  const productImage = (item as any).image;
  
  // DEBUG: Ver qué datos llegan
  console.log('Item completo:', item);
  console.log('Nombre del producto:', productName);
  console.log('Imagen del producto:', productImage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Imagen del producto */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
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

      {/* Información del producto */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{productName}</h3>{" "}
          <p className="text-sm text-gray-600">{formatPrice(item.price)} c/u</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Control de cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(productId, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(productId, item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">
              {formatPrice(subtotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => onRemove(productId)}
        disabled={isUpdating}
        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
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
