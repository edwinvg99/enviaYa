import React, { useEffect, useState } from 'react';
import { categoryService } from '../../../services/category.service';
import type { Category, CategoryPayload } from '../../../types/category.types';
import Toast from '../../../components/Toast';

interface FormErrors { name?: string; description?: string; }

const emptyForm: CategoryPayload = { name: '', description: '', active: true };

const CategoriesAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryPayload>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar categorías';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setIsEditing(true);
    setCurrentId(cat._id!);
    setForm({ name: cat.name, description: cat.description || '', active: cat.active });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    
    // Nombre
    if (!form.name.trim()) {
      errs.name = 'Nombre requerido';
    } else if (form.name.length > 60) {
      errs.name = 'El nombre no puede exceder 60 caracteres';
    }
    
    // Descripción
    if (form.description && form.description.length > 200) {
      errs.description = 'La descripción no puede exceder 200 caracteres';
    }
    
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (isEditing && currentId) {
        await categoryService.updateCategory(currentId, form);
        setToast({ type: 'success', message: 'Categoría actualizada' });
      } else {
        await categoryService.createCategory(form);
        setToast({ type: 'success', message: 'Categoría creada' });
      }
      setShowModal(false);
      await fetchCategories();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error guardando';
      setToast({ type: 'error', message: msg });
    }
  };

  const confirmDelete = async () => {
    if (!showDeleteId) return;
    try {
      await categoryService.deleteCategory(showDeleteId);
      setToast({ type: 'success', message: 'Categoría eliminada' });
      setShowDeleteId(null);
      await fetchCategories();
    } catch (e) {
      const raw = e instanceof Error ? e.message : 'Error eliminando';
      const msg = /productos activos|productos asociados/i.test(raw)
        ? 'No se puede eliminar: tiene productos asociados'
        : raw;
      setToast({ type: 'error', message: msg });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-100">Categorías</h2>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg shadow-sky-600/30">+ Nueva Categoría</button>
      </div>

      {loading && <p className="text-slate-300">Cargando...</p>}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      {!loading && categories.length === 0 && !error && (
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700 shadow-lg shadow-slate-900/50">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-slate-300 text-lg font-medium">No hay categorías registradas.</p>
          <p className="text-slate-400 text-sm mt-2">Comienza creando tu primera categoría</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-300 border-b border-slate-700 bg-slate-900/50">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Activa</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 font-medium text-slate-100">{cat.name}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-md truncate" title={cat.description}>{cat.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${cat.active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>{cat.active ? 'Sí' : 'No'}</span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => openEdit(cat)} className="px-3 py-1 rounded bg-sky-600 text-white text-xs hover:bg-sky-700 shadow-lg shadow-sky-600/30 transition">Editar</button>
                    <button onClick={() => setShowDeleteId(cat._id!)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 shadow-lg shadow-red-600/30 transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl shadow-slate-900/50 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-100">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-slate-300 font-medium">Nombre *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  placeholder="Nombre de la categoría"
                  maxLength={60}
                />
                {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
                {!formErrors.name && <p className="text-xs text-slate-400 mt-1">{form.name.length}/60 caracteres</p>}
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300 font-medium">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                  placeholder="Descripción de la categoría"
                  maxLength={200}
                />
                {formErrors.description && <p className="text-xs text-red-400 mt-1">{formErrors.description}</p>}
                {!formErrors.description && <p className="text-xs text-slate-400 mt-1">{form.description.length}/200 caracteres</p>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="active" className="text-sm text-slate-200">Activa</label>
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
            <p className="text-sm text-slate-300 mb-4">¿Segur@ que deseas eliminar esta categoría? Esta acción es irreversible.</p>
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

export default CategoriesAdmin;
