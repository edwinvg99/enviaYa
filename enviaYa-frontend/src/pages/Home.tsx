import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Envíos Rápidos',
    desc: 'Entregas en tiempo récord para que tus productos lleguen cuando los necesitas.',
    bg: 'from-sky-900/40 to-sky-800/20',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Seguridad Garantizada',
    desc: 'Tus envíos están protegidos con seguimiento en tiempo real y confirmación de entrega.',
    bg: 'from-emerald-900/40 to-emerald-800/20',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Precios Transparentes',
    desc: 'Tarifas justas sin sorpresas. Sabes exactamente lo que pagas antes de confirmar.',
    bg: 'from-violet-900/40 to-violet-800/20',
  },
];

const Home: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const handleTrack = () => {
    const t = trackingNumber.trim();
    if (t) navigate(`/tracking/${t}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-3xl w-full mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Bienvenido a{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-400">
              EnvíaYa
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tu plataforma de confianza para envíos rápidos y seguros.{' '}
            <span className="text-sky-400 font-semibold">
              Conectamos negocios con clientes de manera eficiente.
            </span>
          </p>

          {/* Tracking */}
          <div className="max-w-xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-5 mb-10">
            <div className="text-left mb-3">
              <h2 className="text-base font-semibold text-white">¿Deseas seguir tu envío?</h2>
              <p className="text-sm text-slate-400">Ingresa tu número de tracking para consultar el estado.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ej: TRK-00000000-00000"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={handleTrack}
                disabled={!trackingNumber.trim()}
                className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition duration-200"
              >
                Seguir envío
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-slate-400">
                ¡Hola de nuevo, <span className="text-sky-400 font-semibold">{user?.name}</span>!
              </p>
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-700 hover:to-violet-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-sky-500/25 transition duration-300 transform hover:-translate-y-1"
              >
                Ir a Productos →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-700 hover:to-violet-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-sky-500/25 transition duration-300 transform hover:-translate-y-1"
              >
                Comenzar Ahora
              </Link>
              <Link
                to="/login"
                className="border border-slate-500 hover:border-sky-400 text-slate-300 hover:text-sky-400 px-8 py-4 rounded-full text-lg font-semibold transition duration-300"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-4">
            ¿Por qué elegir <span className="text-sky-400">EnvíaYa</span>?
          </h2>
          <p className="text-center text-slate-400 mb-12 text-lg">
            Soluciones logísticas inteligentes para tu negocio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`group p-7 rounded-2xl bg-gradient-to-br ${f.bg} border border-slate-700 hover:border-slate-500 hover:shadow-xl transition duration-300`}
              >
                <div className="bg-slate-800 rounded-full w-14 h-14 flex items-center justify-center mb-4 shadow-md">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (solo para no autenticados) */}
      {!isAuthenticated && (
        <section className="py-16 px-4 bg-gradient-to-r from-sky-900/60 to-violet-900/60 border-t border-slate-700/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">¿Listo para empezar?</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Únete y gestiona tus envíos de forma simple y segura.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white hover:bg-slate-100 text-slate-900 font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EnvíaYa. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/products" className="hover:text-sky-400 transition-colors">Productos</Link>
            <Link to="/tracking/demo" className="hover:text-sky-400 transition-colors">Seguimiento</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
