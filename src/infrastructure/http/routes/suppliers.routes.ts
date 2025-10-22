import { Router } from 'express';
import { 
  getSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier 
} from '../controllers/suppliers.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

router.get('/', getSuppliers);
router.get('/:id', getSupplierById);

router.post('/', authenticate, authorizeRoles('ADMIN'), createSupplier);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), updateSupplier);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteSupplier);

export default router;
