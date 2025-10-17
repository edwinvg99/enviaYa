import express, { Application } from 'express';
import cors from 'cors';
import usersRouter from './infrastructure/http/routes/users.routes';
import productsRouter from './infrastructure/http/routes/products.routes';
import categoriesRouter from './infrastructure/http/routes/categories.routes';
import ordersRouter from './infrastructure/http/routes/orders.routes';
import shipmentsRouter from './infrastructure/http/routes/shipments.routes';
import notificationsRouter from './infrastructure/http/routes/notifications.routes';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';
import { loggerMiddleware } from './infrastructure/http/middlewares/logger';
import { config } from './infrastructure/config/environment';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

import { Request, Response, NextFunction } from 'express';
import { errorResponse } from './shared/utils/responses';

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json(errorResponse(400, 'JSON inválido en el body', err.message));
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json(errorResponse(400, 'JSON inválido en el body', err.message));
  }
  next(err);
});

const API_BASE = `/api/${config.apiVersion}`;

app.use(`${API_BASE}/users`, usersRouter);
app.use(`${API_BASE}/products`, productsRouter);
app.use(`${API_BASE}/categories`, categoriesRouter);
app.use(`${API_BASE}/orders`, ordersRouter);
app.use(`${API_BASE}/shipments`, shipmentsRouter);
app.use(`${API_BASE}/notifications`, notificationsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);
export default app;
