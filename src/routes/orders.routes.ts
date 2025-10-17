// Rutas de órdenes
import { Router } from 'express';
import { createOrder, getOrders, getOrderById, cancelOrder } from '../controllers/orders.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
