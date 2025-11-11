import { Router } from 'express';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  cancelOrder,
  updateOrderStatus,
  getPendingOrders,
  getOrdersByStatus,
  getUserOrders,
  processAutoCancelOrders
} from '../controllers/orders.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getOrders);
router.get('/pending', authenticate, authorizeRoles('ADMIN', 'VENDOR'), getPendingOrders);
router.get('/status/:status', authenticate, authorizeRoles('ADMIN', 'VENDOR'), getOrdersByStatus);
router.get('/user/:userId', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

router.post('/', authenticate, createOrder);

router.patch('/:id/cancel', authenticate, cancelOrder);
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN', 'VENDOR'), updateOrderStatus);

router.post('/process-auto-cancel', authenticate, authorizeRoles('ADMIN'), processAutoCancelOrders);

export default router;
