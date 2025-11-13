import React, { useEffect, useState } from 'react';
import { supplierService } from '../../../services/supplier.service';
import type { Supplier, SupplierPayload } from '../../../types/supplier.types';
import Toast from '../../../components/Toast';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

const emptyForm: SupplierPayload = {
  name: '',
  email: '',
  phone: '',
  contactPerson: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  },
  isActive: true
};

const SuppliersAdmin: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierPayload>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar proveedores';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (sup: Supplier) => {
    setIsEditing(true);
    setCurrentId(sup._id!);
    setForm({
      name: sup.name,
      email: sup.email,
      phone: sup.phone,
      contactPerson: sup.contactPerson,
      address: { ...sup.address },
      isActive: sup.isActive
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    
    // Nombre
    if (!form.name.trim()) {
      errs.name = 'Nombre requerido';
    } else if (form.name.length > 100) {
      errs.name = 'Máximo 100 caracteres';
    }
    
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = 'Email requerido';
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Email inválido';
    }

    // Teléfono - Validación colombiana +57 seguido de 10 dígitos
    if (!form.phone.trim()) {
      errs.phone = 'Teléfono requerido';
    } else {
      const phoneRegex = /^\+57\d{10}$/;
      if (!phoneRegex.test(form.phone)) {
        errs.phone = 'Formato inválido. Use +57 seguido de 10 dígitos (ej: +573001234567)';
      }
    }
    
    // Persona de contacto
    if (!form.contactPerson.trim()) {
      errs.contactPerson = 'Persona de contacto requerida';
    }
    
    // Dirección
    if (!form.address.street.trim()) {
      errs.street = 'Calle requerida';
    }
    if (!form.address.city.trim()) {
      errs.city = 'Ciudad requerida';
    }
    if (!form.address.state.trim()) {
      errs.state = 'Estado/Provincia requerido';
    }
    if (!form.address.postalCode.trim()) {
      errs.postalCode = 'Código postal requerido';
    }
    if (!form.address.country.trim()) {
      errs.country = 'País requerido';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    // Asegurar estructura correcta del payload
    const payload: SupplierPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      contactPerson: form.contactPerson,
      address: {
        street: form.address.street,
        city: form.address.city,
        state: form.address.state,
        postalCode: form.address.postalCode,
        country: form.address.country
      },
      isActive: form.isActive
    };
    
    console.log('Payload a enviar:', JSON.stringify(payload, null, 2));
    
    try {
      if (isEditing && currentId) {
        await supplierService.updateSupplier(currentId, payload);
        setToast({ type: 'success', message: 'Proveedor actualizado' });
      } else {
        await supplierService.createSupplier(payload);
        setToast({ type: 'success', message: 'Proveedor creado' });
      }
      setShowModal(false);
      await fetchSuppliers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error guardando';
      setToast({ type: 'error', message: msg });
    }
  };

  const confirmDelete = async () => {
    if (!showDeleteId) return;
    try {
      await supplierService.deleteSupplier(showDeleteId);
      setToast({ type: 'success', message: 'Proveedor eliminado' });
      setShowDeleteId(null);
      await fetchSuppliers();
    } catch (e) {
      const raw = e instanceof Error ? e.message : 'Error eliminando';
      const msg = /productos asociados|productos activos/i.test(raw)
        ? 'No se puede eliminar: tiene productos asociados'
        : raw;
      setToast({ type: 'error', message: msg });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-100">Proveedores</h2>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg shadow-sky-600/30">+ Nuevo Proveedor</button>
      </div>

      {loading && <p className="text-slate-300">Cargando...</p>}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      {!loading && suppliers.length === 0 && !error && (
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700 shadow-lg shadow-slate-900/50">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-slate-300 text-lg font-medium">No hay proveedores registrados.</p>
          <p className="text-slate-400 text-sm mt-2">Comienza creando tu primer proveedor</p>
        </div>
      )}

      {!loading && suppliers.length > 0 && (
        <div className="overflow-x-auto bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-300 border-b border-slate-700 bg-slate-900/50">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Ciudad</th>
                <th className="py-3 px-4">Activo</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(sup => (
                <tr key={sup._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 font-medium text-slate-100">{sup.name}</td>
                  <td className="py-3 px-4 text-slate-300">{sup.email}</td>
                  <td className="py-3 px-4 text-slate-300">{sup.phone}</td>
                  <td className="py-3 px-4 text-slate-300">{sup.contactPerson}</td>
                  <td className="py-3 px-4 text-slate-300">{sup.address.city}, {sup.address.state}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${sup.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>{sup.isActive ? 'Sí' : 'No'}</span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => openEdit(sup)} className="px-3 py-1 rounded bg-sky-600 text-white text-xs hover:bg-sky-700 shadow-lg shadow-sky-600/30 transition">Editar</button>
                    <button onClick={() => setShowDeleteId(sup._id!)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 shadow-lg shadow-red-600/30 transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-2xl rounded-xl p-6 shadow-2xl shadow-slate-900/50 border border-slate-700 my-8">
            <h3 className="text-xl font-semibold mb-4 text-slate-100">{isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Nombre *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="Nombre del proveedor"
                    maxLength={100}
                  />
                  {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
                  {!formErrors.name && <p className="text-xs text-slate-400 mt-1">{form.name.length}/100 caracteres</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="email@ejemplo.com"
                  />
                  {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Teléfono *</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="+573001234567"
                  />
                  {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
                  {!formErrors.phone && <p className="text-xs text-slate-400 mt-1">Formato: +57 seguido de 10 dígitos</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Persona de Contacto *</label>
                  <input
                    value={form.contactPerson}
                    onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="Nombre del contacto"
                  />
                  {formErrors.contactPerson && <p className="text-xs text-red-400 mt-1">{formErrors.contactPerson}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-slate-300 font-medium">Dirección - Calle *</label>
                <input
                  value={form.address.street}
                  onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value }}))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  placeholder="Calle, número, detalles"
                />
                {formErrors.street && <p className="text-xs text-red-400 mt-1">{formErrors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Ciudad *</label>
                  <input
                    value={form.address.city}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value }}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="Ciudad"
                  />
                  {formErrors.city && <p className="text-xs text-red-400 mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Estado/Provincia *</label>
                  <input
                    value={form.address.state}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value }}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="Estado o provincia"
                  />
                  {formErrors.state && <p className="text-xs text-red-400 mt-1">{formErrors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">Código Postal *</label>
                  <input
                    value={form.address.postalCode}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address, postalCode: e.target.value }}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="Código postal"
                  />
                  {formErrors.postalCode && <p className="text-xs text-red-400 mt-1">{formErrors.postalCode}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-300 font-medium">País *</label>
                  <input
                    value={form.address.country}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address, country: e.target.value }}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                    placeholder="País"
                  />
                  {formErrors.country && <p className="text-xs text-red-400 mt-1">{formErrors.country}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="active-supplier"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="active-supplier" className="text-sm text-slate-200">Activo</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm hover:bg-slate-600 transition border border-slate-600">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 transition shadow-lg shadow-sky-600/30">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-sm rounded-xl p-5 shadow-2xl shadow-slate-900/50 border border-slate-700">
            <h4 className="text-lg font-semibold mb-3 text-slate-100">Confirmar eliminación</h4>
            <p className="text-sm text-slate-300 mb-4">¿Segur@ que deseas eliminar este proveedor? Esta acción es irreversible.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteId(null)} className="px-3 py-1 rounded-lg bg-slate-700 text-slate-200 text-xs hover:bg-slate-600 transition border border-slate-600">Cancelar</button>
              <button onClick={confirmDelete} className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 transition shadow-lg shadow-red-600/30">Eliminar</button>
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

export default SuppliersAdmin;
