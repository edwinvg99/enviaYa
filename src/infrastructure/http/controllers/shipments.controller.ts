import path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

const shipmentsPath = path.join(__dirname, '..', '..', 'persistence', 'data', 'mock', 'shipments.json');

export const getAllShipments = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(shipmentsPath, 'utf-8');
    const shipments = JSON.parse(raw) as any[];
    
    const { userId, status } = req.query;
    let result = shipments;
    
    if (userId) {
      result = result.filter(s => s.userId === Number(userId));
    }
    
    if (status) {
      result = result.filter(s => s.status === status);
    }
    
    return res.json(successResponse(result));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo envíos', err.message));
  }
};

export const getShipmentById = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(shipmentsPath, 'utf-8');
    const shipments = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    
    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse(400, 'El id debe ser numérico'));
    }
    
    const shipment = shipments.find(s => s.id === id);
    
    if (!shipment) {
      return res.status(404).json(errorResponse(404, 'Envío no encontrado'));
    }
    
    return res.json(successResponse(shipment));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo envío', err.message));
  }
};

export const getShipmentByTracking = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(shipmentsPath, 'utf-8');
    const shipments = JSON.parse(raw) as any[];
    const tracking = req.params.trackingNumber;
    const s = shipments.find(sh => sh.trackingNumber === tracking);
    if (!s) return res.status(404).json(errorResponse(404, 'Envío no encontrado'));
    return res.json(successResponse(s));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo envíos', err.message));
  }
};

export const getShipmentByIdWithStatus = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(shipmentsPath, 'utf-8');
    const shipments = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    const status = String(req.params.status || '');

    if (Number.isNaN(id)) {
      return res.status(400).json(errorResponse(400, 'El id debe ser numérico'));
    }

    const shipment = shipments.find(s => s.id === id && s.status === status);
    if (!shipment) return res.status(404).json(errorResponse(404, 'Envío no encontrado con el estado solicitado'));
    return res.json(successResponse(shipment));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error leyendo envío', err.message));
  }
};

export const updateShipmentStatus = async (req: Request, res: Response) => {
  try {
    const raw = await fs.readFile(shipmentsPath, 'utf-8');
    const shipments = JSON.parse(raw) as any[];
    const id = Number(req.params.id);
    const idx = shipments.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json(errorResponse(404, 'Envío no encontrado'));
    const { status, location, description } = req.body;
    
    const current = shipments[idx].status;
    if (current === 'EN_ENTREGA' && status === 'PENDIENTE') {
      return res.status(422).json(errorResponse(422, 'No se puede retroceder a estados anteriores', { currentStatus: current, attemptedStatus: status }));
    }
    const historyEntry = { status, location, description, timestamp: new Date().toISOString() };
    shipments[idx].status = status;
    shipments[idx].history = shipments[idx].history ? [...shipments[idx].history, historyEntry] : [historyEntry];
    shipments[idx].updatedAt = new Date().toISOString();
    await fs.writeFile(shipmentsPath, JSON.stringify(shipments, null, 2), 'utf-8');
    return res.json(successResponse({ id: shipments[idx].id, trackingNumber: shipments[idx].trackingNumber, status: shipments[idx].status, history: [historyEntry] }, 'Estado de envío actualizado exitosamente'));
  } catch (err: any) {
    return res.status(500).json(errorResponse(500, 'Error actualizando estado', err.message));
  }
};
