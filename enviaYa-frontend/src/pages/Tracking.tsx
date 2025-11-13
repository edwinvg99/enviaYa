import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface ShipmentHistory {
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface Shipment {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  history: ShipmentHistory[];
  carrier: string;
  carrierTrackingNumber?: string;
  notes?: string;
}

type ApiErrorData = { error?: { message?: string } };
type ApiError = { response?: { data?: ApiErrorData } };

const Tracking: React.FC = () => {
  const { trackingNumber: paramTracking } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(paramTracking || '');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (number: string) => {
    if (!number.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/shipments/tracking/${number}`);
      setShipment(res.data.data);
    } catch (err) {
      const axiosErr = err as ApiError;
      const msg = axiosErr?.response?.data?.error?.message || 'No se encontró el envío';
      setError(msg);
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch cuando hay tracking en la URL
  useEffect(() => {
    if (paramTracking) {
      setTrackingNumber(paramTracking);
      fetchTracking(paramTracking);
    }
  }, [paramTracking]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-100">Seguimiento de Envíos</h1>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg shadow-slate-900/50 border border-slate-700 mb-8">
        <label className="block text-sm font-medium text-slate-300 mb-3" htmlFor="trackingInput">Número de Tracking</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="trackingInput"
            type="text"
            placeholder="Ej: ENV123456"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && trackingNumber.trim()) {
                navigate(`/tracking/${trackingNumber.trim()}`);
              }
            }}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={() => trackingNumber.trim() && navigate(`/tracking/${trackingNumber.trim()}`)}
            disabled={loading || !trackingNumber.trim()}
            className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold shadow-lg shadow-sky-600/30 transition"
          >
            {loading ? 'Buscando...' : 'Consultar'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-400 text-sm bg-red-950/30 border border-red-600/50 rounded-lg p-3">{error}</p>}
        {!loading && shipment && (
          <p className="mt-2 text-xs text-slate-400">Presiona Enter para buscar otro envío.</p>
        )}
      </div>
      {loading && (
        <div className="text-center text-sm text-slate-400 py-8">Cargando...</div>
      )}
      {shipment && !loading && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg shadow-slate-900/50 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Detalles del Envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-slate-300"><span className="font-medium text-slate-100">Tracking:</span> {shipment.trackingNumber}</p>
                <p className="text-slate-300"><span className="font-medium text-slate-100">Estado:</span> <span className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium">{shipment.status}</span></p>
                <p className="text-slate-300"><span className="font-medium text-slate-100">Transportista:</span> {shipment.carrier}</p>
                {shipment.carrierTrackingNumber && (
                  <p className="text-slate-300"><span className="font-medium text-slate-100">Tracking Carrier:</span> {shipment.carrierTrackingNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-slate-300"><span className="font-medium text-slate-100">Ubicación Actual:</span> {shipment.currentLocation}</p>
                <p className="text-slate-300"><span className="font-medium text-slate-100">Entrega Estimada:</span> {new Date(shipment.estimatedDelivery).toLocaleString('es-ES')}</p>
                {shipment.actualDelivery && (
                  <p className="text-slate-300"><span className="font-medium text-slate-100">Entregado:</span> {new Date(shipment.actualDelivery).toLocaleString('es-ES')}</p>
                )}
              </div>
            </div>
            {shipment.notes && <p className="mt-4 text-sm text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-700"><span className="font-medium text-slate-100">Notas:</span> {shipment.notes}</p>}
          </div>
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg shadow-slate-900/50 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Historial</h2>
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {shipment.history?.length === 0 && (
                <li className="text-sm text-slate-400 text-center py-4">Sin eventos aún.</li>
              )}
              {shipment.history?.map((h, idx) => (
                <li key={idx} className="border border-slate-700 rounded-lg p-4 bg-slate-900/50 hover:bg-slate-900 transition">
                  <p className="text-sm font-medium text-sky-400">{h.status}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(h.timestamp).toLocaleString('es-ES')}</p>
                  <p className="text-sm mt-2 text-slate-200">{h.description}</p>
                  <p className="text-xs mt-1 text-slate-500">📍 {h.location}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;