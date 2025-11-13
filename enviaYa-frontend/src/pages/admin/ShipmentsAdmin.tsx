import React, { useEffect, useState, useCallback } from 'react';
import { shipmentAdminService } from '../../services/shipmentAdmin.service';
import type { Shipment, ShipmentStatus, UpdateShipmentStatusPayload } from '../../types/shipment.types';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';

const statusLabels: Record<ShipmentStatus, string> = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  EN_TRANSITO: 'En tránsito',
  EN_ENTREGA: 'En entrega',
  ENTREGADO: 'Entregado',
  DEVUELTO: 'Devuelto',
  CANCELADO: 'Cancelado',
  PERDIDO: 'Perdido'
};

const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
  PENDIENTE: ['PREPARANDO', 'CANCELADO'],
  PREPARANDO: ['EN_TRANSITO', 'CANCELADO'],
  EN_TRANSITO: ['EN_ENTREGA', 'CANCELADO'],
  EN_ENTREGA: ['ENTREGADO', 'DEVUELTO', 'CANCELADO'],
  ENTREGADO: [],
  DEVUELTO: ['EN_TRANSITO'],
  CANCELADO: [],
  PERDIDO: []
};

const tabs: (ShipmentStatus | 'ALL')[] = ['ALL','PENDIENTE','PREPARANDO','EN_TRANSITO','EN_ENTREGA','ENTREGADO','PERDIDO'];

interface ToastState { type: 'success' | 'error'; message: string; }

const ShipmentsAdmin: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filtered, setFiltered] = useState<Shipment[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | ShipmentStatus>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [showConfirmDelivery, setShowConfirmDelivery] = useState(false);
  const [advanceStatus, setAdvanceStatus] = useState<ShipmentStatus | ''>('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [carrierTrackingNumber, setCarrierTrackingNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [signature, setSignature] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [toast, setToast] = useState<ToastState|null>(null);
  const { user } = useAuth();

  const loadShipments = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await shipmentAdminService.getAllShipments();
      setShipments(data);
      setFiltered(activeTab === 'ALL' ? data : data.filter(s => s.status === activeTab));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando envíos');
    } finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => { loadShipments(); }, [loadShipments]);

  const changeTab = (tab: 'ALL' | ShipmentStatus) => {
    setActiveTab(tab);
    setFiltered(tab === 'ALL' ? shipments : shipments.filter(s => s.status === tab));
  };

  const openDetail = (s: Shipment) => { setSelected(s); setShowDetail(true); };
  const closeDetail = () => { setShowDetail(false); setSelected(null); };

  const openAdvance = (s: Shipment) => {
    setSelected(s);
    setAdvanceStatus('');
    setLocation('');
    setDescription('');
    setCarrierTrackingNumber('');
    setShowAdvance(true);
  };
  const closeAdvance = () => { setShowAdvance(false); setSelected(null); };

  const openConfirmDelivery = (s: Shipment) => {
    setSelected(s);
    setPhotoUrl('');
    setSignature('');
    setDeliveryNotes('');
    setLocation('');
    setDescription('');
    setShowConfirmDelivery(true);
  };
  const closeConfirmDelivery = () => { setShowConfirmDelivery(false); setSelected(null); };

  const handleAdvanceSubmit = async () => {
    if (!selected || !advanceStatus) return;
    try {
      if (!validTransitions[selected.status].includes(advanceStatus)) {
        setToast({ type:'error', message:'Transición inválida'}); return;
      }
      const payload: UpdateShipmentStatusPayload = {
        status: advanceStatus,
        location: location || 'Ubicación no especificada',
        description: description || 'Actualización de estado',
        carrierTrackingNumber: carrierTrackingNumber || undefined
      };
      const updated = await shipmentAdminService.updateShipmentStatus(selected._id!, payload);
      setToast({ type:'success', message:`Envío ${updated.trackingNumber} -> ${advanceStatus}` });
      closeAdvance();
      loadShipments();
    } catch(e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error actualizando estado';
      setToast({ type:'error', message: msg });
    }
  };

  const handleConfirmDelivery = async () => {
    if (!selected) return;
    try {
      if (!photoUrl && !signature) {
        setToast({ type:'error', message:'Se requiere foto o firma'}); return;
      }
      const payload: UpdateShipmentStatusPayload = {
        status: 'ENTREGADO',
        location: location || 'Dirección de entrega',
        description: description || 'Entrega confirmada',
        deliveryConfirmation: {
          confirmedBy: user?.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
          photoUrl: photoUrl || undefined,
          signature: signature || undefined,
          notes: deliveryNotes || undefined
        }
      };
      const updated = await shipmentAdminService.updateShipmentStatus(selected._id!, payload);
      setToast({ type:'success', message:`Entrega confirmada: ${updated.trackingNumber}` });
      closeConfirmDelivery();
      loadShipments();
    } catch(e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error confirmando entrega';
      setToast({ type:'error', message: msg });
    }
  };

  const markOverdueLost = async () => {
    try {
      const res = await shipmentAdminService.markOverdueLost();
      setToast({ type:'success', message:`Envíos perdidos marcados: ${res.processed}` });
      loadShipments();
    } catch(e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error marcando envíos perdidos';
      setToast({ type:'error', message: msg });
    }
  };

  const formatDate = (d: string | Date) => new Date(d).toLocaleDateString('es-ES');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Gestión de Envíos</h1>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => changeTab(t as 'ALL' | ShipmentStatus)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab===t? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30': 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>{t==='ALL'? 'Todos': statusLabels[t as ShipmentStatus]}</button>
        ))}
        {user?.role === 'ADMIN' && (
          <button onClick={markOverdueLost} className="ml-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-lg shadow-red-600/30 transition">Marcar vencidos como perdidos</button>
        )}
      </div>
      {loading && <Loading />}
      {error && <div className="text-red-400 mb-3 bg-red-950/30 border border-red-600/50 rounded-lg p-3">{error}</div>}

      <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl shadow-lg shadow-slate-900/50">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr className="text-slate-300">
              <th className="p-3 text-left">Tracking</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Orden</th>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Carrier</th>
              <th className="p-3 text-left">Guía</th>
              <th className="p-3 text-left">Est. Entrega</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filtered.map(s => (
              <tr key={s._id} className="hover:bg-slate-700/30 transition">
                <td className="p-3 font-mono text-slate-200">{s.trackingNumber}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600">{statusLabels[s.status]}</span>
                </td>
                <td className="p-3 text-slate-300">{s.orderId}</td>
                <td className="p-3 text-slate-300">{s.userId}</td>
                <td className="p-3 text-slate-300">{s.carrier}</td>
                <td className="p-3 text-slate-300">{s.carrierTrackingNumber || '-'}</td>
                <td className="p-3 text-slate-300">{formatDate(s.estimatedDelivery)}</td>
                <td className="p-3 flex gap-2">
                  <Button size="xs" onClick={() => openDetail(s)}>Ver</Button>
                  {validTransitions[s.status].length>0 && s.status!=='EN_ENTREGA' && (
                    <Button size="xs" variant="secondary" onClick={() => openAdvance(s)}>Avanzar</Button>
                  )}
                  {s.status==='EN_ENTREGA' && (
                    <Button size="xs" variant="secondary" onClick={() => openConfirmDelivery(s)}>Confirmar Entrega</Button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length===0 && !loading && (
              <tr><td className="p-6 text-center text-slate-400" colSpan={8}>
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                No hay envíos
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {showDetail && selected && (
  <Modal isOpen={true} title={`Envío ${selected.trackingNumber}`} onClose={closeDetail}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p><span className="font-semibold">Estado:</span> {statusLabels[selected.status]}</p>
                <p><span className="font-semibold">Carrier:</span> {selected.carrier}</p>
                <p><span className="font-semibold">Guía:</span> {selected.carrierTrackingNumber || '—'}</p>
              </div>
              <div>
                <p><span className="font-semibold">Estimado:</span> {formatDate(selected.estimatedDelivery)}</p>
                {selected.actualDelivery && <p><span className="font-semibold">Entregado:</span> {formatDate(selected.actualDelivery)}</p>}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Dirección:</p>
              <p>{selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.postalCode}, {selected.shippingAddress.country}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Historial:</p>
              <ul className="max-h-40 overflow-y-auto space-y-1">
                {selected.history.slice().reverse().map((h,i) => (
                  <li key={i} className="text-gray-300">[{new Date(h.timestamp).toLocaleDateString('es-ES')}] {statusLabels[h.status]} - {h.location}: {h.description}</li>
                ))}
              </ul>
            </div>
            {selected.deliveryConfirmation && (
              <div className="border border-green-700 rounded p-2">
                <p className="font-semibold mb-1">Confirmación de Entrega</p>
                {selected.deliveryConfirmation.photoUrl && <p>Foto: <a className="text-blue-400" href={selected.deliveryConfirmation.photoUrl} target="_blank">Ver</a></p>}
                {selected.deliveryConfirmation.signature && <p>Firma: {selected.deliveryConfirmation.signature}</p>}
                <p>Confirmado por: {selected.deliveryConfirmation.confirmedBy}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal avanzar */}
      {showAdvance && selected && (
  <Modal isOpen={true} title={`Avanzar envío ${selected.trackingNumber}`} onClose={closeAdvance}>
          <div className="space-y-3 text-sm">
            <div>
              <label htmlFor="advanceStatus" className="block text-xs mb-1">Nuevo estado</label>
              <select id="advanceStatus" aria-label="Nuevo estado" value={advanceStatus} onChange={e=>setAdvanceStatus(e.target.value as ShipmentStatus)} className="w-full bg-gray-800 rounded p-2 text-sm">
                <option value="">Selecciona...</option>
                {validTransitions[selected.status].map(st => (
                  <option key={st} value={st}>{statusLabels[st]}</option>
                ))}
              </select>
            </div>
            {selected.status === 'PREPARANDO' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1">Carrier Tracking</label>
                  <input value={carrierTrackingNumber} onChange={e=>setCarrierTrackingNumber(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" placeholder="Guía única" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs mb-1">Ubicación</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" placeholder="Ciudad / Centro" />
            </div>
            <div>
              <label className="block text-xs mb-1">Descripción</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" rows={3} placeholder="Detalle del avance" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="secondary" onClick={closeAdvance}>Cancelar</Button>
              <Button onClick={handleAdvanceSubmit} disabled={!advanceStatus}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal confirmar entrega */}
      {showConfirmDelivery && selected && (
  <Modal isOpen={true} title={`Confirmar entrega ${selected.trackingNumber}`} onClose={closeConfirmDelivery}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1">Foto (URL)</label>
                <input value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs mb-1">Firma (texto)</label>
                <input value={signature} onChange={e=>setSignature(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" placeholder="Nombre receptor" />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1">Ubicación entrega</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" placeholder="Dirección final" />
            </div>
            <div>
              <label className="block text-xs mb-1">Descripción</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" rows={3} placeholder="Observaciones" />
            </div>
            <div>
              <label className="block text-xs mb-1">Notas</label>
              <textarea value={deliveryNotes} onChange={e=>setDeliveryNotes(e.target.value)} className="w-full bg-gray-800 rounded p-2 text-sm" rows={2} placeholder="Notas internas" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="secondary" onClick={closeConfirmDelivery}>Cancelar</Button>
              <Button onClick={handleConfirmDelivery}>Confirmar</Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ShipmentsAdmin;
