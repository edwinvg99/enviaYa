import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cart.service';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import type { Cart } from '../types/cart.types';
import type { Address } from '../types/user.types';

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 10000;

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState<Address>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Colombia'
  });

  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const cartData = await cartService.getCart(user._id!);
      
      if (!cartData || cartData.items.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCart(cartData);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const calculateShippingCost = () => {
    if (!cart) return 0;
    return cart.total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.total + calculateShippingCost();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const validateForm = (): boolean => {
    if (!shippingData.street || !shippingData.city || !shippingData.state || 
        !shippingData.postalCode || !shippingData.country) {
      setError('Por favor completa todos los campos de dirección');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    try {
      setProcessing(true);
      setError(null);

      const response = await api.post('/checkout/confirm', {
        userId: user._id,
        shippingData,
        paymentMethod,
        notes
      });

      // Redirigir a la página de éxito con el número de orden
      navigate(`/orders/success/${response.data.order._id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al procesar la orden');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null; // Ya redirige a /cart
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-100">Finalizar Compra</h1>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de envío y pago */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dirección de envío */}
              <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6 text-amber-300">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Dirección de Envío</h2>
                
                <div className="space-y-4 text-white">
                  <Input
                    label="Dirección"
                    type="text"
                    name="street"
                    value={shippingData.street}
                    onChange={handleInputChange}
                    placeholder="Calle 123 #45-67"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4 text-white">
                    <Input
                      label="Ciudad"
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      placeholder="Bogotá"
                      required
                    />
                    <Input
                      label="Departamento"
                      type="text"
                      name="state"
                      value={shippingData.state}
                      onChange={handleInputChange}
                      placeholder="Cundinamarca"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-white">
                    <Input
                      label="Código Postal"
                      type="text"
                      name="postalCode"
                      value={shippingData.postalCode}
                      onChange={handleInputChange}
                      placeholder="110111"
                      required
                    />
                    <Input
                      label="País"
                      type="text"
                      name="country"
                      value={shippingData.country}
                      onChange={handleInputChange}
                      placeholder="Colombia"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Método de Pago</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-sky-500/50 hover:bg-slate-700/30 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CREDIT_CARD"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 accent-sky-500"
                    />
                    <span className="font-medium text-slate-200">Tarjeta de Crédito</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-sky-500/50 hover:bg-slate-700/30 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="DEBIT_CARD"
                      checked={paymentMethod === 'DEBIT_CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 accent-sky-500"
                    />
                    <span className="font-medium text-slate-200">Tarjeta Débito</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-sky-500/50 hover:bg-slate-700/30 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 accent-sky-500"
                    />
                    <span className="font-medium text-slate-200">Pago Contra Entrega</span>
                  </label>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notas del pedido (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Instrucciones especiales de entrega..."
                  />
                </div>
              </div>
            </div>

            {/* Resumen de la orden */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Resumen de la Orden</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal ({cart.items.length} productos):</span>
                    <span className="font-semibold text-slate-100">{formatPrice(cart.total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-300">
                    <span>Envío:</span>
                    <span className="font-semibold">
                      {calculateShippingCost() === 0 ? (
                        <span className="text-emerald-400">¡GRATIS!</span>
                      ) : (
                        <span className="text-slate-100">{formatPrice(calculateShippingCost())}</span>
                      )}
                    </span>
                  </div>

                  {cart.total < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 p-2 rounded">
                      Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - cart.total)} más para envío gratis
                    </p>
                  )}

                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-slate-100">Total:</span>
                      <span className="text-sky-400">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={processing}
                  disabled={processing}
                  className="w-full text-lg mb-3"
                >
                  Confirmar Pedido
                </Button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  disabled={processing}
                  className="w-full px-6 py-3 border-2 border-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Volver al Carrito
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
