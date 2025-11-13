import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="animate-spin">
          <svg className="h-16 w-16 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col ">

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-900">
        <div className="max-w-3xl w-full mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-100 mb-6 leading-tight">
            Bienvenido a <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-300">EnvíaYa</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tu plataforma de confianza para envíos rápidos y seguros.<br />
            <span className="text-primary-700 font-semibold">Conectamos negocios con clientes de manera eficiente.</span>
          </p>

          {/* Seguimiento público de envíos */}
          <div className="max-w-xl mx-auto bg-white backdrop-blur rounded-2xl shadow p-4 md:p-6 mb-8">
            <div className="text-left mb-3">
              <h2 className="text-lg font-semibold text-gray-900">¿Deseas seguir tu envío?</h2>
              <p className="text-sm text-gray-600">Ingresa tu número de tracking para consultar el estado.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ej: TRK-00000000-00000"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <button
                onClick={() => trackingNumber.trim() && navigate(`/tracking/${trackingNumber.trim()}`)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 disabled:opacity-50"
                disabled={!trackingNumber.trim()}
              >
                Seguir envío
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="space-y-6 animate-fade-in gap-9">
              <div className="inline-block bg-white rounded-full shadow-lg p-6 mb-4">
                <p className="text-lg text-gray-800">
                  ¡Hola de nuevo, <span className="font-bold text-primary-600">{user?.name}</span>! 
                </p>
              </div>
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                Ir a Productos
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
              {/* <Link
                to="/register"
                className="group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                Comenzar Ahora
              </Link> */}
              {/* <Link
                to="/login"
                className="group bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                Iniciar Sesión
              </Link> */}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto"> */}
          {/* <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6">
            ¿Por qué elegir EnvíaYa?
          </h2> */}
          {/* <p className="text-center text-gray-600 mb-12 text-lg">Soluciones logísticas inteligentes para tu negocio</p> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
            {/* Feature 1 */}
            {/* <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 hover:shadow-2xl hover:scale-105 transition duration-300 transform">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition duration-300">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Envíos Rápidos</h3>
              <p className="text-gray-700 text-center">
                Entregas en tiempo récord para que tus productos lleguen cuando los necesites.
              </p>
            </div> */}

            {/* Feature 2 */}
            {/* <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl hover:scale-105 transition duration-300 transform">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Seguridad Garantizada</h3>
              <p className="text-gray-700 text-center">
                Tus envíos están protegidos en todo momento con seguimiento en tiempo real.
              </p>
            </div> */}

            {/* Feature 3 */}
            {/* <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl hover:scale-105 transition duration-300 transform">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition duration-300">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Precios Competitivos</h3>
              <p className="text-gray-700 text-center">
                Tarifas justas y transparentes sin sorpresas ni costos ocultos.
              </p>
            </div> */}
          {/* </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* {!isAuthenticated && (
        <section className="py-20 px-4 bg-red-400 animate-fade-in ">
          <div className=" mx-auto text-center flex justify-center items-center flex-col">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Únete a miles de usuarios que confían en nosotros para sus envíos.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white hover:bg-gray-100 text-primary-600 font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>
      )}      {!isAuthenticated && (
        <section className="py-20 px-4 bg-red-400 animate-fade-in ">
          <div className=" mx-auto text-center flex justify-center items-center flex-col">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Únete a miles de usuarios que confían en nosotros para sus envíos.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white hover:bg-gray-100 text-primary-600 font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>
      )} */}

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 EnvíaYa.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Home;
