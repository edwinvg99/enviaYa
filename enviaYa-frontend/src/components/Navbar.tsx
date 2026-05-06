import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cart.service';
import NotificationsDropdown from './NotificationsDropdown';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  const loadCartCount = async () => {
    if (!user) return;
    try {
      const cart = await cartService.getCart(user._id!);
      setCartItemCount(cart?.items?.length || 0);
    } catch {
      setCartItemCount(0);
    }
  };

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
        location.pathname === to
          ? 'text-sky-400 bg-slate-800'
          : 'text-slate-300 hover:text-sky-400'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-slate-900 border-b border-slate-700/60 shadow-lg shadow-black/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + desktop links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-400">
                EnvíaYa
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLink('/products', 'Productos')}
              {isAuthenticated && navLink('/orders', 'Mis Órdenes')}
              {(user?.role === 'ADMIN' || user?.role === 'VENDOR') &&
                navLink('/admin', 'Panel Admin')}
            </div>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <NotificationsDropdown />
                <Link
                  to="/cart"
                  className="relative text-slate-300 hover:text-sky-400 p-2 transition-colors duration-200"
                  aria-label="Carrito de compras"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                {navLink('/products', 'Productos')}
                {navLink('/login', 'Iniciar Sesión')}
                <Link
                  to="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-lg shadow-sky-600/20"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <>
                <NotificationsDropdown />
                <Link
                  to="/cart"
                  className="relative text-slate-300 hover:text-sky-400 p-2"
                  aria-label="Carrito"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="text-slate-300 hover:text-sky-400 p-2 rounded-md transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700/60 bg-slate-900 px-4 py-3 space-y-1">
          <Link to="/products" className="block text-slate-300 hover:text-sky-400 py-2 text-sm font-medium">Productos</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="block text-slate-300 hover:text-sky-400 py-2 text-sm font-medium">Mis Órdenes</Link>
              {(user?.role === 'ADMIN' || user?.role === 'VENDOR') && (
                <Link to="/admin" className="block text-slate-300 hover:text-sky-400 py-2 text-sm font-medium">Panel Admin</Link>
              )}
              <div className="pt-2 border-t border-slate-700/60">
                <UserMenu />
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-slate-300 hover:text-sky-400 py-2 text-sm font-medium">Iniciar Sesión</Link>
              <Link to="/register" className="block bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition duration-200">Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
