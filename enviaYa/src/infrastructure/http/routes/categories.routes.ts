import { Router } from 'express';
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categories.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post('/', authenticate, authorizeRoles('ADMIN', 'VENDOR'), createCategory);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'VENDOR'), updateCategory);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'VENDOR'), deleteCategory);

export default router;
