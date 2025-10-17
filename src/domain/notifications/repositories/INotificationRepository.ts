// Puerto (Interface) del repositorio de notificaciones
import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  findAll(): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  findByUserId(userId: number): Promise<Notification[]>;
  findUnreadByUserId(userId: number): Promise<Notification[]>;
  create(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification>;
  update(id: number, notification: Partial<Notification>): Promise<Notification | null>;
  markAsRead(id: number): Promise<Notification | null>;
  delete(id: number): Promise<boolean>;
}
