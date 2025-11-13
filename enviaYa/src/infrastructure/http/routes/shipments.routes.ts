import { Router } from 'express';
import { 
  getShipments, 
  getShipmentById, 
  getShipmentByTracking,
  createShipment, 
  updateShipmentStatus,
  getShipmentsByStatus,
  getUserShipments,
  markOverdueAsLost,
  confirmDelivery
} from '../controllers/shipments.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

router.get('/tracking/:trackingNumber', getShipmentByTracking);

router.get('/', authenticate, authorizeRoles('ADMIN', 'VENDOR'), getShipments);
router.get('/status/:status', authenticate, authorizeRoles('ADMIN', 'VENDOR'), getShipmentsByStatus);
router.get('/user/:userId', authenticate, getUserShipments);
router.get('/:id', authenticate, getShipmentById);

router.post('/', authenticate, authorizeRoles('ADMIN', 'VENDOR'), createShipment);

router.patch('/:id/status', authenticate, authorizeRoles('ADMIN', 'VENDOR'), updateShipmentStatus);
router.post('/:id/confirm-delivery', authenticate, confirmDelivery);

router.post('/mark-overdue-lost', authenticate, authorizeRoles('ADMIN'), markOverdueAsLost);

export default router;