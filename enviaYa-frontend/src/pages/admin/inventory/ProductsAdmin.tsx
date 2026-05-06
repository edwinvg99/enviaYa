/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { productService } from '../../../services/product.service';
import { categoryService } from '../../../services/category.service';
import { supplierService } from '../../../services/supplier.service';
import type { Category } from '../../../types/category.types';
import type { Supplier } from '../../../types/supplier.types';
import type { Product, ProductsData, ProductFilters } from '../../../types/product.types';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Modal from '../../../components/Modal';
import Toast from '../../../components/Toast';
import { useAuth } from '../../../context/AuthContext';

const defaultForm: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  isActive: true,
  category: '',
  supplier: ''
};

  interface ToastMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }

const ProductsAdmin: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'USER';

  const [data, setData] = useState<ProductsData>({ products: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [onlyActive, setOnlyActive] = useState<boolean | undefined>(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(defaultForm);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState<ToastMessage | null>(null);

  const canCreate = role === 'ADMIN';
  const canEdit = role === 'ADMIN' || role === 'VENDOR';
  const canDelete = role === 'ADMIN';
  const canAdjustStock = role === 'ADMIN' || role === 'VENDOR';

    const showToast = (type: ToastMessage['type'], message: string) => {
      setToast({ type, message });
    };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
  const filters: ProductFilters = { page, limit };
      if (search) filters.search = search;
      if (typeof onlyActive !== 'undefined') filters.isActive = onlyActive;

      const result = canAdjustStock
        ? await productService.getProductsAdmin(filters)
        : await productService.getProducts(filters);

      setData(result);
    } catch (e) {
      const msg = (e as any)?.response?.data?.message || 'Error al cargar productos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, onlyActive]);

  useEffect(() => {
    // cargar cat y prov para formularios
    const fetchMeta = async () => {
      try {
        const [cats, sups] = await Promise.all([
          categoryService.getCategories(),
          supplierService.getSuppliers()
        ]);
        setCategories(cats);
        setSuppliers(sups);
      } catch (e) {
        console.error('Error cargando categorías/proveedores', e);
      }
    };
    fetchMeta();
  }, []);

    const validateForm = (): boolean => {
      const errors: Record<string, string> = {};

      if (!form.name?.trim()) {
        errors.name = 'El nombre es requerido';
      }

      if (form.price === undefined || form.price < 0) {
        errors.price = 'El precio debe ser mayor o igual a 0';
      }

      if (form.stock === undefined || form.stock < 0) {
        errors.stock = 'El stock debe ser mayor o igual a 0';
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(defaultForm);
      setFormErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ ...p });
      setFormErrors({});
    setIsModalOpen(true);
  };

  const onSave = async () => {
      if (!validateForm()) {
        showToast('error', 'Por favor corrige los errores en el formulario');
        return;
      }

    try {
      setSaving(true);
      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct._id, form);
        setData(prev => ({
          ...prev,
          products: prev.products.map(p => p._id === updated._id ? updated : p)
        }));
          showToast('success', 'Producto actualizado correctamente');
      } else {
        await productService.createProduct(form);
        await load();
          showToast('success', 'Producto creado correctamente');
      }
      setIsModalOpen(false);
        setFormErrors({});
    } catch (e) {
      const msg = (e as any)?.response?.data?.message || 'Error al guardar producto';
        showToast('error', msg);
    } finally {
      setSaving(false);
    }
  };

    const openDeleteModal = (p: Product) => {
      setProductToDelete(p);
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
      if (!productToDelete) return;

    try {
        setDeleting(true);
        await productService.deleteProduct(productToDelete._id);
      setData(prev => ({
        ...prev,
          products: prev.products.filter(p => p._id !== productToDelete._id),
        pagination: { ...prev.pagination, totalItems: Math.max(prev.pagination.totalItems - 1, 0) }
      }));
        showToast('success', 'Producto eliminado correctamente');
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    } catch (e) {
      const msg = (e as any)?.response?.data?.message || 'Error al eliminar producto';
        showToast('error', msg);
      } finally {
        setDeleting(false);
    }
  };

  const onAdjustStock = async (id: string, delta: number) => {
    try {
      const updated = await productService.updateStock(id, delta);
      setData(prev => ({
        ...prev,
        products: prev.products.map(p => p._id === id ? { ...p, stock: updated.stock } : p)
      }));
        showToast('success', `Stock ajustado: ${delta > 0 ? '+' : ''}${delta}`);
    } catch (e) {
      const msg = (e as any)?.response?.data?.message || 'Error al ajustar stock';
        showToast('error', msg);
    }
  };

  const totalPages = useMemo(() => data.pagination.totalPages || 1, [data.pagination.totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        {/* Toast notification */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Inventario</h1>
      </div>

      <div className="flex items-end gap-3 mb-6 ">
        <Input
          label="Buscar"
          placeholder="Nombre del producto"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-slate-800 text-slate-100 border-slate-700 placeholder-slate-400 focus:ring-sky-500 "
        />
        {canAdjustStock && (
          <div className="flex flex-col ">
            <label className="text-sm font-medium text-slate-300 mb-2">Estado</label>
            <select
              aria-label="Filtro por estado"
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={String(onlyActive)}
                onChange={(e) => { setOnlyActive(e.target.value === 'undefined' ? undefined : e.target.value === 'true'); setPage(1); }}
            >
              <option value="undefined">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        )}
        <div className="ml-auto" />
        {canCreate && (
            <Button onClick={openCreate} className="whitespace-nowrap">+ Nuevo producto</Button>
        )}
      </div>

      <div className="overflow-x-auto bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {loading ? (
              <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-400">{error}</td>
              </tr>
            ) : data.products.length === 0 ? (
              <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-slate-300">No hay productos que mostrar</p>
                      {canCreate && <p className="text-sm text-slate-400">Comienza creando tu primer producto</p>}
                    </div>
                  </td>
              </tr>
            ) : (
              data.products.map(p => (
                  <tr key={p._id} className="hover:bg-slate-700/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center border border-slate-700">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      <div>
                        <div className="font-medium text-slate-100">{p.name}</div>
                          <div className="text-xs text-slate-400">
                            {categories.find(c => c._id === p.category)?.name || 'Sin categoría'}
                          </div>
                      </div>
                    </div>
                  </td>
                    <td className="px-4 py-3 text-sky-400 font-medium">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {p.stock}
                        </span>
                      {canAdjustStock && (
                        <div className="flex items-center gap-1">
                            <button 
                              className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition disabled:opacity-50 border border-slate-600" 
                              onClick={() => onAdjustStock(p._id, -1)}
                              disabled={p.stock === 0}
                              title="Decrementar stock"
                            >
                              -1
                            </button>
                            <button 
                              className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition border border-slate-600"
                              onClick={() => onAdjustStock(p._id, +1)}
                              title="Incrementar stock"
                            >
                              +1
                            </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded font-medium border ${p.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {canEdit && (
                        <Button 
                          variant="secondary" 
                          onClick={() => openEdit(p)}
                          className="text-sm px-3 py-1.5"
                        >
                          Editar
                        </Button>
                      )}
                      {canDelete && (
                        <Button 
                          variant="danger" 
                          onClick={() => openDeleteModal(p)}
                          className="text-sm px-3 py-1.5"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Mostrando {data.products.length} de {data.pagination.totalItems} productos (Página {data.pagination.currentPage} de {totalPages})
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            ← Anterior
          </Button>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Siguiente →
          </Button>
        </div>
      </div>

      {/* Modal Crear/Editar */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setFormErrors({}); }} 
          title={editingProduct ? 'Editar producto' : 'Nuevo producto'}
        footer={
          <>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setFormErrors({}); }}>
                Cancelar
              </Button>
              <Button onClick={onSave} isLoading={saving}>
                {editingProduct ? 'Guardar cambios' : 'Crear producto'}
              </Button>
          </>
        }
      >
          <div className="space-y-4">
            <Input 
              label="Nombre *" 
              value={form.name || ''} 
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} 
              error={formErrors.name}
              placeholder="Ej: Laptop HP"
            />
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 border-gray-300"
                rows={3}
                value={form.description || ''}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe el producto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Precio * ($)" 
                type="number" 
                step="0.01"
                min="0"
                value={form.price ?? 0} 
                onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))} 
                error={formErrors.price}
                placeholder="0.00"
              />
              <Input 
                label="Stock inicial *" 
                type="number" 
                min="0"
                value={form.stock ?? 0} 
                onChange={(e) => setForm(f => ({ ...f, stock: Number(e.target.value) }))} 
                error={formErrors.stock}
                placeholder="0"
              />
            </div>

            <Input 
              label="URL de imagen" 
              value={form.image || ''} 
              onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} 
              placeholder="https://ejemplo.com/imagen.jpg"
            />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select 
                aria-label="Seleccionar categoría" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 border-gray-300" 
                value={form.category || ''} 
                onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              >
              <option value="">Selecciona una categoría</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
              <select 
                aria-label="Seleccionar proveedor" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 border-gray-300" 
                value={form.supplier || ''} 
                onChange={(e) => setForm(f => ({ ...f, supplier: e.target.value }))}
              >
              <option value="">Selecciona un proveedor</option>
              {suppliers.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input 
                id="isActive" 
                type="checkbox" 
                checked={!!form.isActive} 
                onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Producto activo y visible en la tienda
              </label>
          </div>

            <p className="text-xs text-gray-500">* Campos requeridos</p>
        </div>
      </Modal>

        {/* Modal Confirmar Eliminación */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }}
          title="Confirmar eliminación"
          footer={
            <>
              <Button variant="secondary" onClick={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete} isLoading={deleting}>
                Sí, eliminar
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete?.name}</strong>?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.
              </p>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default ProductsAdmin;
