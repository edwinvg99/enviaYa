import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

const ordersPath = path.join(__dirname, '..', '..', 'persistence', 'data', 'mock', 'orders.json');

export const createOrder = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(raw) as any[];
    const newOrder = {
      id: orders.length + 1,
      orderNumber: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*90000)+10000}`,
      status: 'PENDIENTE',
      ...req.body,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf-8');
    return res.status(201).json(successResponse(newOrder, 'Orden creada exitosamente'));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error creando orden', err.message));
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(raw) as any[];
    const { userId } = req.query;
    const filtered = userId ? orders.filter(o => String(o.userId) === String(userId)) : orders;
    return res.json(successResponse(filtered));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error obteniendo órdenes', err.message));
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json(errorResponse(404, 'Orden no encontrada'));
    return res.json(successResponse(order));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo orden', err.message));
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json(errorResponse(404, 'Orden no encontrada'));
    if (orders[idx].status !== 'PENDIENTE') {
      return res.status(422).json(errorResponse(422, 'Solo se pueden cancelar órdenes en estado PENDIENTE', { currentStatus: orders[idx].status }));
    }
    orders[idx].status = 'CANCELADO';
    orders[idx].updatedAt = new Date().toISOString();
    await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf-8');
    return res.json(successResponse(orders[idx], 'Orden cancelada exitosamente. Stock devuelto al inventario.'));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error cancelando orden', err.message));
  }
};
