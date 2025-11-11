import { Notification } from "../../../../domain/notifications/entities/Notification";
import { NotificationModel } from "../../data/models/NotificationModel";

export class NotificationRepositoryMongo {
  async findAll(userId: string): Promise<Notification[]> {
    try {
      const notifications = await NotificationModel.find({ userId })
        .sort({ createdAt: -1 });
      return notifications.map(n => n.toObject() as Notification);
    } catch (error) {
      console.error('Error al buscar notificaciones:', error);
      throw new Error('Error al buscar notificaciones');
    }
  }

  async findById(id: string): Promise<Notification | null> {
    try {
      const notification = await NotificationModel.findById(id);
      return notification ? notification.toObject() as Notification : null;
    } catch (error) {
      console.error('Error al buscar notificación por ID:', error);
      throw new Error('Error al buscar la notificación');
    }
  }

  async create(notificationData: Notification): Promise<Notification> {
    try {
      const notification = new NotificationModel(notificationData);
      const savedNotification = await notification.save();
      return savedNotification.toObject() as Notification;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw new Error('No se pudo crear la notificación');
    }
  }

  async markAsRead(id: string): Promise<Notification | null> {
    try {
      const notification = await NotificationModel.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      return notification ? notification.toObject() as Notification : null;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw new Error('No se pudo marcar la notificación como leída');
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await NotificationModel.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      return true;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw new Error('No se pudo marcar las notificaciones como leídas');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await NotificationModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw new Error('No se pudo eliminar la notificación');
    }
  }
}
