import React from "react";
import { Link, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";

const InventoryLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBasePath = location.pathname === "/admin/inventory";

  if (isBasePath) {
    // Redirigir por defecto a productos
    return <Navigate to="/admin/inventory/products" replace />;
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto bg-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-sky-400 transition border border-slate-700"
          title="Volver al panel de control"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-white">
          Gestión de Inventario
        </h1>
      </div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/admin/inventory/products"
          className={`px-4 py-2 rounded-lg ${
            location.pathname.includes("/products")
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700"
          } transition`}
        >
          Productos
        </Link>
        <Link
          to="/admin/inventory/categories"
          className={`px-4 py-2 rounded-lg ${
            location.pathname.includes("/categories")
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700"
          } transition`}
        >
          Categorías
        </Link>
        <Link
          to="/admin/inventory/suppliers"
          className={`px-4 py-2 rounded-lg ${
            location.pathname.includes("/suppliers")
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700"
          } transition`}
        >
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
