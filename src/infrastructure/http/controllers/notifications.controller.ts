import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

const notificationsPath = path.join(__dirname, '..', '..', 'persistence', 'data', 'mock', 'notifications.json');

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(notificationsPath, 'utf-8');
    const notifs = JSON.parse(raw) as any[];
    const { userId } = req.query;
    const filtered = userId ? notifs.filter(n => String(n.userId) === String(userId)) : notifs;
    return res.json(successResponse(filtered));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo notificaciones', err.message));
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(notificationsPath, 'utf-8');
    const notifs = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse(400, 'El id debe ser numérico'));
    }
    
    const notification = notifs.find(n => n.id === id);
    
    if (!notification) {
      return res.status(404).json(errorResponse(404, 'Notificación no encontrada'));
    }
    
    return res.json(successResponse(notification));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo notificación', err.message));
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(notificationsPath, 'utf-8');
    const notifs = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    const idx = notifs.findIndex(n => n.id === id);
    if (idx === -1) return res.status(404).json(errorResponse(404, 'Notificación no encontrada'));
    notifs[idx].read = true;
    notifs[idx].updatedAt = new Date().toISOString();
    await fs.writeFile(notificationsPath, JSON.stringify(notifs, null, 2), 'utf-8');
    return res.json(successResponse({ id: notifs[idx].id, read: true, updatedAt: notifs[idx].updatedAt }, 'Notificación marcada como leída'));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error actualizando notificación', err.message));
  }
};
