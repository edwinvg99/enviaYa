import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';

const InventoryLayout: React.FC = () => {
  const location = useLocation();
  const isBasePath = location.pathname === '/admin/inventory';

  if (isBasePath) {
    // Redirigir por defecto a productos
    return <Navigate to="/admin/inventory/products" replace />;
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto bg-slate-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Inventario</h1>

      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/inventory/products" className={`px-4 py-2 rounded-lg ${location.pathname.includes('/products') ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-100 hover:bg-gray-700'} transition`}>
          Productos
        </Link>
        <Link to="/admin/inventory/categories" className={`px-4 py-2 rounded-lg ${location.pathname.includes('/categories') ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-100 hover:bg-gray-700'} transition`}>
          Categorías
        </Link>
        <Link to="/admin/inventory/suppliers" className={`px-4 py-2 rounded-lg ${location.pathname.includes('/suppliers') ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-100 hover:bg-gray-700'} transition`}>
          Proveedores
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl shadow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default InventoryLayout;
