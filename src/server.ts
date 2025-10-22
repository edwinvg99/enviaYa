import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('Falta definir MONGO_URI en el archivo .env');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas con éxito'))
  .catch(err => console.error('Error de conexión:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`   http://localhost:${PORT}/api/v1/users`);
  console.log(`   http://localhost:${PORT}/api/v1/products`);
  console.log(`   http://localhost:${PORT}/api/v1/categories`);
  console.log(`   http://localhost:${PORT}/api/v1/orders`);
  console.log(`   http://localhost:${PORT}/api/v1/shipments`);
  console.log(`   http://localhost:${PORT}/api/v1/suppliers`);
  console.log(`   http://localhost:${PORT}/api/v1/notifications`);
});