import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateStock,
  getProductsAdmin 
} from '../controllers/products.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/admin/all', authenticate, authorizeRoles('ADMIN', 'VENDOR'), getProductsAdmin);

router.post('/', authenticate, authorizeRoles('ADMIN'), createProduct);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'VENDOR'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteProduct);
router.patch('/:id/stock', authenticate, authorizeRoles('ADMIN', 'VENDOR'), updateStock);

export default router;
