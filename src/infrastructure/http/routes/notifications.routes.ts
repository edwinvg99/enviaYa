import { Router } from 'express';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/notifications.controller';

const router = Router();

router.get('/user/:userId', getUserNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.patch('/user/:userId/read-all', markAllNotificationsAsRead);
router.delete('/:id', deleteNotification);

export default router;