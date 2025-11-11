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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

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
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dirección de Envío</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Dirección"
                    type="text"
                    name="street"
                    value={shippingData.street}
                    onChange={handleInputChange}
                    placeholder="Calle 123 #45-67"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4">
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
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CREDIT_CARD"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Tarjeta de Crédito</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="DEBIT_CARD"
                      checked={paymentMethod === 'DEBIT_CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Tarjeta Débito</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Pago Contra Entrega</span>
                  </label>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del pedido (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Instrucciones especiales de entrega..."
                  />
                </div>
              </div>
            </div>

            {/* Resumen de la orden */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen de la Orden</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} productos):</span>
                    <span className="font-semibold">{formatPrice(cart.total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span className="font-semibold">
                      {calculateShippingCost() === 0 ? (
                        <span className="text-green-600">¡GRATIS!</span>
                      ) : (
                        formatPrice(calculateShippingCost())
                      )}
                    </span>
                  </div>

                  {cart.total < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                      Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - cart.total)} más para envío gratis
                    </p>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatPrice(calculateTotal())}</span>
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
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
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
