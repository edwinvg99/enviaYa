import { Request, Response } from 'express';
import { OrderRepositoryMongo } from '../../persistence/mongo/repositories/OrderRepositoryMongo';
import { CreateOrderUseCase } from '../../../application/orders/use-cases/CreateOrderUseCase';
import { CancelOrderUseCase } from '../../../application/orders/use-cases/CancelOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../../application/orders/use-cases/UpdateOrderStatusUseCase';
import { AutoCancelPendingOrdersUseCase } from '../../../application/orders/use-cases/AutoCancelPendingOrdersUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';


export const getOrders = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;

    const orders = await orderRepository.findAll(filters, page, limit);
    
    res.json(successResponse(orders, 'Órdenes obtenidas exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener órdenes', error));
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const order = await orderRepository.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json(errorResponse(404, 'Orden no encontrada'));
    }
    
    res.json(successResponse(order, 'Orden obtenida exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener orden', error));
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const createOrderUseCase = new CreateOrderUseCase();
    const order = await createOrderUseCase.execute(req.body);
    
    res.status(201).json(successResponse(order, 'Orden creada exitosamente'));
  } catch (error: any) {
    res.status(400).json(errorResponse(400, 'Error al crear orden', error.message || error));
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const cancelOrderUseCase = new CancelOrderUseCase();
    const userRole = req.user?.role || 'USER';
    const { reason } = req.body;
    
    const cancelled = await cancelOrderUseCase.execute(req.params.id, userRole, reason);
    
    res.json(successResponse(null, 'Orden cancelada exitosamente'));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al cancelar orden', error));
  }
};

export const getPendingOrders = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const orders = await orderRepository.findPendingOrders();
    
    res.json(successResponse(orders, 'Órdenes pendientes obtenidas exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener órdenes pendientes', error));
  }
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const orders = await orderRepository.findOrdersByStatus(req.params.status);
    
    res.json(successResponse(orders, 'Órdenes obtenidas exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener órdenes', error));
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const userId = req.user?.id || req.params.userId;
    
    const orders = await orderRepository.findByUserId(userId);
    
    res.json(successResponse(orders, 'Órdenes del usuario obtenidas exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener órdenes del usuario', error));
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase();
    const userRole = req.user?.role || 'USER';
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json(errorResponse(400, 'El campo status es requerido'));
    }
    
    const updatedOrder = await updateOrderStatusUseCase.execute(req.params.id, status, userRole);
    
    res.json(successResponse(updatedOrder, 'Estado de orden actualizado exitosamente'));
  } catch (error: any) {
    res.status(400).json(errorResponse(400, 'Error al actualizar estado de orden', error.message || error));
  }
};

export const processAutoCancelOrders = async (req: Request, res: Response) => {
  try {
    const autoCancelUseCase = new AutoCancelPendingOrdersUseCase();
    const processedCount = await autoCancelUseCase.execute();
    
    res.json(successResponse(processedCount, `Se procesaron ${processedCount} órdenes canceladas automáticamente`));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al procesar cancelación automática', error));
  }
};

const orderRepo = new OrderRepositoryMongo();

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await orderRepo.findByUserId(userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No se encontraron órdenes para este usuario' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes del usuario' });
  }
};