import { Request, Response } from 'express';
import { NotificationRepositoryMongo } from '../../persistence/mongo/repositories/NotificationRepositoryMongo';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const notificationRepository = new NotificationRepositoryMongo();
    const userId = req.user?.id || req.params.userId;
    
    const notifications = await notificationRepository.findAll(userId);
    
    res.json(successResponse(200, 'Notificaciones obtenidas exitosamente', notifications));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener notificaciones', error));
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notificationRepository = new NotificationRepositoryMongo();
    const notification = await notificationRepository.markAsRead(req.params.id);
    
    if (!notification) {
      return res.status(404).json(errorResponse(404, 'Notificación no encontrada'));
    }
    
    res.json(successResponse(200, 'Notificación marcada como leída', notification));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al marcar notificación', error));
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const notificationRepository = new NotificationRepositoryMongo();
    const userId = req.user?.id || req.params.userId;
    
    await notificationRepository.markAllAsRead(userId);
    
    res.json(successResponse(200, 'Todas las notificaciones marcadas como leídas'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al marcar notificaciones', error));
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notificationRepository = new NotificationRepositoryMongo();
    const deleted = await notificationRepository.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json(errorResponse(404, 'Notificación no encontrada'));
    }
    
    res.json(successResponse(200, 'Notificación eliminada exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al eliminar notificación', error));
  }
};