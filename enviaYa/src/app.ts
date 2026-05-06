import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import usersRouter from './infrastructure/http/routes/users.routes';
import productsRouter from './infrastructure/http/routes/products.routes';
import categoriesRouter from './infrastructure/http/routes/categories.routes';
import ordersRouter from './infrastructure/http/routes/orders.routes';
import shipmentsRouter from './infrastructure/http/routes/shipments.routes';
import suppliersRouter from './infrastructure/http/routes/suppliers.routes';
import notificationsRouter from './infrastructure/http/routes/notifications.routes';
import cartRoutes from './infrastructure/http/routes/cart.routes';
import checkoutRoutes from './infrastructure/http/routes/checkout.routes';
import adminRoutes from './infrastructure/http/routes/admin.routes';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';
import { loggerMiddleware } from './infrastructure/http/middlewares/logger';
import { config } from './infrastructure/config/environment';
import { errorResponse } from './shared/utils/responses';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS — allow frontend origin(s) from env, fallback to localhost
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Malformed JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    return res.status(400).json(errorResponse(400, 'JSON inválido en el body', err.message));
  }
  next(err);
});

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 429, message: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
  },
});

// General rate limit for all API calls
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 429, message: 'Demasiadas solicitudes. Intenta más tarde.' },
  },
});

const API_BASE = `/api/${config.apiVersion}`;

app.use(`${API_BASE}`, generalLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'EnviaYa API Documentation',
}));

app.use(`${API_BASE}/users/login`, authLimiter);
app.use(`${API_BASE}/users/register`, authLimiter);

app.use(`${API_BASE}/users`, usersRouter);
app.use(`${API_BASE}/products`, productsRouter);
app.use(`${API_BASE}/categories`, categoriesRouter);
app.use(`${API_BASE}/orders`, ordersRouter);
app.use(`${API_BASE}/shipments`, shipmentsRouter);
app.use(`${API_BASE}/suppliers`, suppliersRouter);
app.use(`${API_BASE}/notifications`, notificationsRouter);
app.use(`${API_BASE}/cart`, cartRoutes);
app.use(`${API_BASE}/checkout`, checkoutRoutes);
app.use(`${API_BASE}/admin`, adminRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json(errorResponse(404, 'Ruta no encontrada'));
});

app.use(errorHandler);

export default app;
