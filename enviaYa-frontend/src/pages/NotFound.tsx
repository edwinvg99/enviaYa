import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-400 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-white mb-3">Página no encontrada</h2>
      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full font-semibold transition duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  </div>
);

export default NotFound;
