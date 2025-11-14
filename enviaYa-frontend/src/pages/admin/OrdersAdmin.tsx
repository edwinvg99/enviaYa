import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAdminService } from '../../services/orderAdmin.service';
import { shipmentAdminService } from '../../services/shipmentAdmin.service';
import type { Order, OrderStatus } from '../../types/order.types';
import Toast from '../../components/Toast';

type FilterTab = 'all' | 'PENDIENTE' | 'PREPARANDO' | 'EN_TRANSITO' | 'EN_ENTREGA' | 'ENTREGADO' | 'CANCELADO';

const OrdersAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAdminService.getAllOrders();
      setOrders(data);
      setFilteredOrders(activeTab === 'all' ? data : data.filter(o => o.status === activeTab));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar órdenes';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setFilteredOrders(tab === 'all' ? orders : orders.filter(o => o.status === tab));
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const openCancelModal = (order: Order) => {
    if (order.status !== 'PENDIENTE') {
      setToast({ type: 'error', message: 'Solo órdenes en estado PENDIENTE pueden cancelarse' });
      return;
    }
    setSelectedOrder(order);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedOrder) return;
    try {
      await orderAdminService.cancelOrder(selectedOrder._id!, cancelReason || undefined);
      setToast({ type: 'success', message: `Orden ${selectedOrder.orderNumber} cancelada. Stock devuelto y cliente notificado.` });
      setShowCancelModal(false);
      setSelectedOrder(null);
      await fetchOrders();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error cancelando orden';
      setToast({ type: 'error', message: msg });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Si cambiamos a PREPARANDO, crear automáticamente el envío
      if (newStatus === 'PREPARANDO') {
        await orderAdminService.updateOrderStatus(orderId, newStatus);
        // Crear envío automáticamente (backend lo pone en PENDIENTE y orden sigue en PREPARANDO)
        try {
          const shipment = await shipmentAdminService.createShipment(orderId);
          setToast({ type: 'success', message: `Orden preparándose. Envío creado: ${shipment.trackingNumber}` });
        } catch (shipErr: unknown) {
          const error = shipErr as { response?: { data?: { message?: string } } };
          const shipMsg = error.response?.data?.message || 'Envío no pudo crearse';
          setToast({ type: 'error', message: `Orden en PREPARANDO, pero ${shipMsg}` });
        }
      } else {
        await orderAdminService.updateOrderStatus(orderId, newStatus);
        setToast({ type: 'success', message: 'Estado actualizado' });
      }
      await fetchOrders();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error actualizando estado';
      setToast({ type: 'error', message: msg });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDIENTE: 'bg-yellow-600',
      PREPARANDO: 'bg-blue-600',
      EN_TRANSITO: 'bg-purple-600',
      EN_ENTREGA: 'bg-indigo-600',
      ENTREGADO: 'bg-green-600',
      CANCELADO: 'bg-red-600'
    };
    return <span className={`inline-block w-28 text-center px-2 py-1 rounded text-xs font-semibold text-white ${colors[status]}`}>{status}</span>;
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toFixed(2)}` : '-';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-sky-400 transition border border-slate-700"
            title="Volver al panel de control"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-slate-100">Gestión de Órdenes</h1>
        </div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition text-sm border border-slate-600 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <button onClick={() => handleTabChange('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'all' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          Todas
        </button>
        <button onClick={() => handleTabChange('PENDIENTE')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'PENDIENTE' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          Pendientes
        </button>
        <button onClick={() => handleTabChange('PREPARANDO')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'PREPARANDO' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          En Preparación
        </button>
        <button onClick={() => handleTabChange('EN_TRANSITO')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'EN_TRANSITO' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          En Tránsito
        </button>
        <button onClick={() => handleTabChange('EN_ENTREGA')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'EN_ENTREGA' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          En Entrega
        </button>
        <button onClick={() => handleTabChange('ENTREGADO')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'ENTREGADO' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          Entregadas
        </button>
        <button onClick={() => handleTabChange('CANCELADO')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'CANCELADO' ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
          Canceladas
        </button>
      </div>

      {loading && <p className="text-slate-300">Cargando órdenes...</p>}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      {!loading && filteredOrders.length === 0 && !error && (
        <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-8 text-center">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-slate-300 text-lg font-medium">No hay órdenes {activeTab !== 'all' ? `en estado ${activeTab}` : 'registradas'}.</p>
          <p className="text-slate-400 text-sm mt-2">Las órdenes aparecerán aquí cuando los clientes realicen compras</p>
        </div>
      )}

      {!loading && filteredOrders.length > 0 && (
        <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-300 border-b border-slate-700 bg-slate-900/50">
                  <th className="py-3 px-4">Número</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4 font-medium text-slate-100">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {typeof order.userId === 'object'
                        ? (order.userId.name || order.userId.email || order.userId._id)
                        : order.userId}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{order.items.length}</td>
                    <td className="py-3 px-4 text-sky-400 font-semibold">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4 text-right space-x-2 ">
                      <button onClick={() => openDetail(order)} className="px-3 py-1 rounded bg-sky-600 text-white text-xs hover:bg-sky-700 shadow-lg shadow-sky-600/30 transition">Ver</button>
                      {order.status === 'PENDIENTE' && (
                        <button onClick={() => openCancelModal(order)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 shadow-lg shadow-red-600/30 transition">Cancelar</button>
                      )}
                      {order.status === 'PENDIENTE' && (
                        <button onClick={() => handleStatusChange(order._id!, 'PREPARANDO')} className="px-3 py-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition">Preparar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-3xl rounded-xl p-6 shadow-2xl shadow-slate-900/50 border border-slate-700 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-100">Orden {selectedOrder.orderNumber}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-200 text-2xl transition">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-slate-400">Estado:</p>
                <p className="font-medium mt-1">{getStatusBadge(selectedOrder.status)}</p>
              </div>
              <div>
                <p className="text-slate-400">Fecha:</p>
                <p className="font-medium text-slate-200 mt-1">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-400">Método de pago:</p>
                <p className="font-medium text-slate-200 mt-1">{selectedOrder.paymentMethod || '-'}</p>
              </div>
              <div>
                <p className="text-slate-400">Estado de pago:</p>
                <p className="font-medium text-slate-200 mt-1">{selectedOrder.paymentStatus || '-'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-slate-200">Dirección de envío</h4>
              <div className="bg-slate-900 p-3 rounded-lg text-sm text-slate-300 border border-slate-700">
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p>{selectedOrder.shippingAddress.postalCode} - {selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-slate-200">Items</h4>
              <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50">
                    <tr className="text-left text-slate-300">
                      <th className="py-2 px-3">Producto</th>
                      <th className="py-2 px-3">Cantidad</th>
                      <th className="py-2 px-3 text-right">Precio Unit.</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-700">
                        <td className="py-2 px-3 text-gray-300">
                          {typeof item.productId === 'object' ? item.productId.name : item.productId}
                        </td>
                        <td className="py-2 px-3 text-gray-300">{item.quantity}</td>
                        <td className="py-2 px-3 text-right text-gray-300">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2 px-3 text-right text-gray-200 font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-sm space-y-1">
                <p className="text-gray-400">Subtotal: <span className="text-gray-200">{formatCurrency(selectedOrder.subtotal)}</span></p>
                <p className="text-gray-400">Envío: <span className="text-gray-200">{formatCurrency(selectedOrder.shippingCost)}</span></p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(selectedOrder.total)}</p>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="mt-4 bg-gray-800 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Notas:</p>
                <p className="text-sm text-gray-200">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-md rounded-lg p-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 text-sky-500">Cancelar Orden {selectedOrder.orderNumber}</h4>
            <p className="text-sm text-gray-300 mb-4">Esta acción cancelará la orden, devolverá el stock automáticamente y notificará al cliente.</p>
            
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-300">Razón de cancelación (opcional)</label>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-100 h-20 resize-none focus:outline-none focus:ring focus:ring-primary-600"
                placeholder="Ej: Stock agotado, solicitud del cliente..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowCancelModal(false); setSelectedOrder(null); }} className="px-4 py-2 rounded bg-gray-700 text-gray-200 text-sm hover:bg-gray-600">Volver</button>
              <button onClick={confirmCancel} className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-500">Confirmar Cancelación</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default OrdersAdmin;
