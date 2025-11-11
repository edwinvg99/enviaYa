import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cart.service';
import { useAuth } from '../context/AuthContext';
import CartItemComponent from '../components/CartItemComponent';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Button from '../components/Button';
import type { Cart } from '../types/cart.types';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart(user._id!);
      setCart(cartData);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (!user || !cart) return;

    try {
      setUpdating(true);
      setError(null);
      
      if (quantity <= 0) {
        await cartService.removeFromCart({ userId: user._id!, productId });
      } else {
        await cartService.updateQuantity(user._id!, productId, quantity);
      }
      
      await loadCart();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al actualizar cantidad');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;

    try {
      setUpdating(true);
      setError(null);
      await cartService.removeFromCart({ userId: user._id!, productId });
      await loadCart();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar producto');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!user) return;

    if (!window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await cartService.clearCart(user._id!);
      await loadCart();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al vaciar el carrito');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {isEmpty ? (
          <EmptyState
            icon={
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Tu carrito está vacío"
            message="Explora nuestro catálogo y agrega productos a tu carrito."
            action={{
              label: 'Ver productos',
              onClick: () => navigate('/products')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Productos ({cart.items.length})
                </h2>
                <button
                  onClick={handleClearCart}
                  disabled={updating}
                  className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  Vaciar carrito
                </button>
              </div>

              {cart.items.map((item, index) => (
                <CartItemComponent
                  key={index}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  isUpdating={updating}
                />
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span className="font-semibold">A calcular</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatPrice(cart.total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      * El costo de envío se calculará en el siguiente paso
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={updating}
                  className="w-full text-lg"
                >
                  Proceder al Pago
                </Button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full mt-3 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
