// Rutas de envíos
import { Router } from 'express';
import { 
  getAllShipments, 
  getShipmentById, 
  getShipmentByTracking, 
  getShipmentByIdWithStatus,
  updateShipmentStatus 
} from '../controllers/shipments.controller';

const router = Router();

router.get('/', getAllShipments);
router.get('/tracking/:trackingNumber', getShipmentByTracking);
router.get('/:id/:status', getShipmentByIdWithStatus);
router.get('/:id', getShipmentById);
router.put('/:id/status', updateShipmentStatus);

export default router;
