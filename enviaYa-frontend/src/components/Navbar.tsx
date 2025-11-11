import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cart.service';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartItemCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCartCount = async () => {
    if (!user) return;
    
    try {
      const cart = await cartService.getCart(user._id!);
      setCartItemCount(cart?.items?.length || 0);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItemCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">EnvíaYa</span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/products"
                  className="text-white hover:text-primary-100 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Productos
                </Link>
                <Link
                  to="/orders"
                  className="text-white hover:text-primary-100 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Mis Órdenes
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notificaciones */}
                <NotificationsDropdown />

                {/* Carrito */}
                <Link
                  to="/cart"
                  className="relative text-white hover:text-primary-100 p-2"
                  aria-label="Carrito de compras"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <span className="text-white hidden sm:inline">Hola, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/products"
                  className="text-white hover:text-primary-100 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Productos
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:text-primary-100 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-primary-50 text-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
