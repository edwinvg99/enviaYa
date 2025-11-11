import { Request, Response } from 'express';
import { ShipmentRepositoryMongo } from '../../persistence/mongo/repositories/ShipmentRepositoryMongo';
import { CreateShipmentUseCase } from '../../../application/shipments/use-cases/CreateShipmentUseCase';
import { UpdateShipmentStatusUseCase } from '../../../application/shipments/use-cases/UpdateShipmentStatusUseCase';
import { MarkOverdueShipmentsAsLostUseCase } from '../../../application/shipments/use-cases/MarkOverdueShipmentsAsLostUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';

export const getShipments = async (req: Request, res: Response) => {
  try {
    const shipmentRepository = new ShipmentRepositoryMongo();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;

    const shipments = await shipmentRepository.findAll(filters, page, limit);
    
    res.json(successResponse(200, 'Envíos obtenidos exitosamente', shipments));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener envíos', error));
  }
};

export const getShipmentById = async (req: Request, res: Response) => {
  try {
    const shipmentRepository = new ShipmentRepositoryMongo();
    const shipment = await shipmentRepository.findById(req.params.id);
    
    if (!shipment) {
      return res.status(404).json(errorResponse(404, 'Envío no encontrado'));
    }
    
    res.json(successResponse(200, 'Envío obtenido exitosamente', shipment));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener envío', error));
  }
};

export const getShipmentByTracking = async (req: Request, res: Response) => {
  try {
    const shipmentRepository = new ShipmentRepositoryMongo();
    const shipment = await shipmentRepository.findByTrackingNumber(req.params.trackingNumber);
    
    if (!shipment) {
      return res.status(404).json(errorResponse(404, 'Envío no encontrado'));
    }
    
    res.json(successResponse(200, 'Envío obtenido exitosamente', shipment));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener envío', error));
  }
};

export const createShipment = async (req: Request, res: Response) => {
  try {
    const createShipmentUseCase = new CreateShipmentUseCase();
    const shipment = await createShipmentUseCase.execute(req.body.orderId);
    
    res.status(201).json(successResponse(201, 'Envío creado exitosamente', shipment));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al crear envío', error));
  }
};

export const updateShipmentStatus = async (req: Request, res: Response) => {
  try {
    const updateShipmentStatusUseCase = new UpdateShipmentStatusUseCase();
    const userRole = req.user?.role || 'USER';
    const { status, location, description, carrierTrackingNumber } = req.body;
    
    const shipment = await updateShipmentStatusUseCase.execute(
      req.params.id, 
      status, 
      location, 
      description, 
      userRole,
      carrierTrackingNumber
    );
    
    res.json(successResponse(200, 'Estado de envío actualizado exitosamente', shipment));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al actualizar estado de envío', error));
  }
};

export const getShipmentsByStatus = async (req: Request, res: Response) => {
  try {
    const shipmentRepository = new ShipmentRepositoryMongo();
    const shipments = await shipmentRepository.findByStatus(req.params.status);
    
    res.json(successResponse(200, 'Envíos obtenidos exitosamente', shipments));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener envíos', error));
  }
};

export const getUserShipments = async (req: Request, res: Response) => {
  try {
    const shipmentRepository = new ShipmentRepositoryMongo();
    const userId = req.user?.id || req.params.userId;
    
    const shipments = await shipmentRepository.findByUserId(userId);
    
    res.json(successResponse(200, 'Envíos del usuario obtenidos exitosamente', shipments));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener envíos del usuario', error));
  }
};

export const markOverdueAsLost = async (req: Request, res: Response) => {
  try {
    const markOverdueUseCase = new MarkOverdueShipmentsAsLostUseCase();
    const processedCount = await markOverdueUseCase.execute();
    
    res.json(successResponse(200, `Se marcaron ${processedCount} envíos como perdidos`));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al procesar envíos vencidos', error));
  }
};