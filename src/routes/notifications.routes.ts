// Rutas de notificaciones
import { Router } from 'express';
import { getNotifications, getNotificationById, markAsRead } from '../controllers/notifications.controller';

const router = Router();

router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.put('/:id/read', markAsRead);

export default router;
