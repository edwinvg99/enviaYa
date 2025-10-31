import { Router } from 'express';
import { createAdminUser } from '../../http/controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

// 🧠 Solo el SUPER_ADMIN puede acceder
router.post('/create-admin', authenticate, authorizeRoles('SUPER_ADMIN'), createAdminUser);

export default router;
