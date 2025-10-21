//import app from './app';
//import { config } from './config/environment';

//const PORT = config.port || 3000;

//app.listen(PORT, () => {
 // console.log(`Server running on http://localhost:${PORT}/api/${config.apiVersion}`);
//});

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './infrastructure/http/routes/users.routes';
import productRoutes from './infrastructure/http/routes/products.routes'; // ✅ Importamos las rutas de productos

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Rutas principales
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes); // ✅ Nueva ruta de productos

// ✅ Verificar que MONGO_URI esté definida
if (!process.env.MONGO_URI) {
  throw new Error('Falta definir MONGO_URI en el archivo .env');
}

// ✅ Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas con éxito'))
  .catch(err => console.error('Error de conexión:', err));

// ✅ Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <h2>Servidor EnviaYa corriendo correctamente 🚀</h2>
    <p>Accede a las rutas disponibles:</p>
    <ul>
      <li><a href="http://localhost:3000/api/v1/users">Usuarios</a></li>
      <li><a href="http://localhost:3000/api/v1/products">Productos</a></li>
    </ul>
  `);
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`   http://localhost:${PORT}/api/v1/users`);
  console.log(`   http://localhost:${PORT}/api/v1/products`);
});
