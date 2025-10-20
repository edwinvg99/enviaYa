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

dotenv.config();

const app = express();
app.use(express.json());


app.use('/api/v1/users', userRoutes);

// verificar que mongo_URI en el archivo .env esté definida
if (!process.env.MONGO_URI) {
  throw new Error('Falta definir MONGO_URI en el archivo .env');
}

// conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas con éxito'))
  .catch(err => console.error('Error de conexión:', err));

// ruta principal
app.get('/', (req, res) => {
  res.send('Servidor EnviaYa corriendo correctamente en http://localhost:3000');
});

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});

