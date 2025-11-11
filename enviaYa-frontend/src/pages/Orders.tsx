import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Button from '../components/Button';
import type { Order, OrderStatus } from '../types/order.types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getUserOrders(user._id!);
      setOrders(ordersData);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!cancelReason.trim()) {
      setError('Debes proporcionar un motivo para cancelar la orden');
      return;
    }

    try {
      setCanceling(true);
      await orderService.cancelOrder(orderId, cancelReason);
      await loadOrders();
      setSelectedOrder(null);
      setShowCancelModal(false);
      setCancelReason('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cancelar la orden');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadgeVariant = (status: OrderStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'ENTREGADO':
        return 'success';
      case 'CANCELADO':
        return 'error';
      case 'EN_TRANSITO':
      case 'EN_ENTREGA':
        return 'info';
      case 'PREPARANDO':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mis Órdenes</h1>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No tienes órdenes"
            message="Aún no has realizado ninguna compra. Explora nuestro catálogo y haz tu primera orden."
            action={{
              label: 'Ver productos',
              onClick: () => navigate('/products')
            }}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Badge variant={getStatusBadgeVariant(order.status)} size="lg">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Productos:</p>
                    <p className="font-semibold">{order.items.length} artículo(s)</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total:</p>
                    <p className="font-semibold text-primary-600">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estado de pago:</p>
                    <p className="font-semibold">{order.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalles de la orden */}
        {selectedOrder && (
          <Modal
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            title={`Orden ${selectedOrder.orderNumber}`}
            footer={
              <>
                {selectedOrder.status === 'PENDIENTE' && (
                  <Button
                    onClick={() => {
                      setShowCancelModal(true);
                    }}
                    disabled={canceling}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Cancelar Orden
                  </Button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado:</p>
                <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                  {selectedOrder.status.replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha:</p>
                <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Dirección de envío:</p>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                  </p>
                  <p>
                    {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Productos:</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="font-medium">Producto {index + 1}</span>
                      <span>x{item.quantity}</span>
                      <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Envío:</span>
                  <span className="font-semibold">{formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notas:</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Modal para solicitar motivo de cancelación */}
        {showCancelModal && selectedOrder && (
          <Modal
            isOpen={showCancelModal}
            onClose={() => {
              setShowCancelModal(false);
              setCancelReason('');
            }}
            title="Cancelar Orden"
            footer={
              <>
                <Button
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  isLoading={canceling}
                  disabled={canceling || !cancelReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirmar Cancelación
                </Button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                  disabled={canceling}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas cancelar la orden <strong>{selectedOrder.orderNumber}</strong>?
              </p>
              <div>
                <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de cancelación *
                </label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ej: Cliente solicitó cancelación, producto no disponible, etc."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={canceling}
                  required
                />
                {!cancelReason.trim() && (
                  <p className="text-xs text-gray-500 mt-1">
                    El motivo es obligatorio
                  </p>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Orders;
