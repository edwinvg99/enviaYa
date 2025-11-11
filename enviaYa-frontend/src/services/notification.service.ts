import api from './api';
import type { 
  Notification, 
  NotificationsResponse, 
  NotificationResponse 
} from '../types/notification.types';

export const notificationService = {
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await api.get<NotificationsResponse>(`/notifications/user/${userId}`);
    return response.data.data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.patch<NotificationResponse>(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    const notifications = await notificationService.getUserNotifications(userId);
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    await Promise.all(
      unreadNotifications.map(n => notificationService.markAsRead(n._id))
    );
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    const notifications = await notificationService.getUserNotifications(userId);
    return notifications.filter(n => !n.isRead).length;
  }
};
