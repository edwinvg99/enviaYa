import { Request, Response } from 'express';
import { ShipmentRepositoryMongo } from '../../persistence/mongo/repositories/ShipmentRepositoryMongo';
import { CreateShipmentUseCase } from '../../../application/shipments/use-cases/CreateShipmentUseCase';
import { UpdateShipmentStatusUseCase } from '../../../application/shipments/use-cases/UpdateShipmentStatusUseCase';
import { MarkOverdueShipmentsAsLostUseCase } from '../../../application/shipments/use-cases/MarkOverdueShipmentsAsLostUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';
import { UserModel } from '../../persistence/data/models/UserModel';
import { OrderRepositoryMongo } from '../../persistence/mongo/repositories/OrderRepositoryMongo';
import { EmailService } from '../../../application/services/EmailService';



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
    const { status, location, description, carrierTrackingNumber, deliveryConfirmation } = req.body;
    
    const shipment = await updateShipmentStatusUseCase.execute(
      req.params.id, 
      status, 
      location, 
      description, 
      userRole,
      carrierTrackingNumber,
      deliveryConfirmation
    );

    
    if (shipment.status === "ENTREGADO") {
      const orderRepo = new OrderRepositoryMongo();
      const order = await orderRepo.findById(shipment.orderId);

      if (order) {
        const user = await UserModel.findById(order.userId);
        if (user) {
          await EmailService.sendOrderEmail({
            email_type: "ORDER_DELIVERED",
            to_email: user.email,
            user_name: user.name ?? "Cliente",
            order_number: order.orderNumber,
            order_total: order.total,
            order_status: "ENTREGADO",
            delivery_date: new Date().toLocaleDateString("es-CO"),
          });
        }
      }
    }
    
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



export const confirmDelivery = async (req: Request, res: Response) => {
  try {
    const updateShipmentStatusUseCase = new UpdateShipmentStatusUseCase();
    const userRole = req.user?.role || 'USER';
    const { photoUrl, signature, notes } = req.body;
    
    const shipmentRepository = new ShipmentRepositoryMongo();
    const shipment = await shipmentRepository.findById(req.params.id);
    
    if (!shipment) {
      return res.status(404).json(errorResponse(404, 'Envío no encontrado'));
    }
    
    if (shipment.status !== 'EN_ENTREGA') {
      return res.status(400).json(errorResponse(400, 'Solo se pueden confirmar envíos en estado EN_ENTREGA'));
    }
    
    const deliveryConfirmation = {
      confirmedBy: userRole === 'USER' ? 'CUSTOMER' as const : 'ADMIN' as const,
      photoUrl,
      signature,
      notes
    };
    
    const updatedShipment = await updateShipmentStatusUseCase.execute(
      req.params.id,
      'ENTREGADO',
      shipment.currentLocation,
      'Entrega confirmada exitosamente',
      userRole,
      undefined,
      deliveryConfirmation
    );

   
    const orderRepo = new OrderRepositoryMongo();
    const order = await orderRepo.findById(shipment.orderId);

    if (order) {
      const user = await UserModel.findById(order.userId);
      if (user) {
        await EmailService.sendOrderEmail({
          email_type: "ORDER_DELIVERED",
          to_email: user.email,
          user_name: user.name ?? "Cliente",
          order_number: order.orderNumber,
          order_total: order.total,
          order_status: "ENTREGADO",
          delivery_date: new Date().toLocaleDateString("es-CO"),
        });
      }
    }

    res.json(successResponse(200, 'Entrega confirmada exitosamente', updatedShipment));

  } catch (error: any) {
    res.status(400).json(errorResponse(400, 'Error al confirmar entrega', error.message || error));
  }
};
