import { Request, Response } from 'express';
import { OrderRepositoryMongo } from '../../persistence/mongo/repositories/OrderRepositoryMongo';
import { CreateOrderUseCase } from '../../../application/orders/use-cases/CreateOrderUseCase';
import { CancelOrderUseCase } from '../../../application/orders/use-cases/CancelOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../../application/orders/use-cases/UpdateOrderStatusUseCase';
import { AutoCancelPendingOrdersUseCase } from '../../../application/orders/use-cases/AutoCancelPendingOrdersUseCase';
import { successResponse, errorResponse } from '../../../shared/utils/responses';
import * as emailjs from '@emailjs/nodejs';
import { UserModel } from '../../persistence/data/models/UserModel';

/* ============================================================
   GET ALL ORDERS
============================================================ */
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

/* ============================================================
   GET ORDER BY ID
============================================================ */
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

/* ============================================================
   CREATE ORDER (usado por checkout)
============================================================ */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const createOrderUseCase = new CreateOrderUseCase();
    const order = await createOrderUseCase.execute(req.body);

    res.status(201).json(successResponse(order, 'Orden creada exitosamente'));
  } catch (error: any) {
    res.status(400).json(errorResponse(400, 'Error al crear orden', error.message || error));
  }
};

/* ============================================================
   CANCEL ORDER
============================================================ */
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const cancelOrderUseCase = new CancelOrderUseCase();
    const userRole = req.user?.role || 'USER';
    const userId = req.user?._id;
    const { reason } = req.body;

    await cancelOrderUseCase.execute(req.params.id, userRole, reason, userId);

    res.json(successResponse(null, 'Orden cancelada exitosamente'));
  } catch (error) {
    res.status(400).json(errorResponse(400, 'Error al cancelar orden', error));
  }
};

/* ============================================================
   GET PENDING ORDERS
============================================================ */
export const getPendingOrders = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const orders = await orderRepository.findPendingOrders();

    res.json(successResponse(orders, 'Órdenes pendientes obtenidas exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener órdenes pendientes', error));
  }
};

/* ============================================================
   GET ORDERS BY STATUS
============================================================ */
export const getOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const orderRepository = new OrderRepositoryMongo();
    const orders = await orderRepository.findOrdersByStatus(req.params.status);

    res.json(successResponse(orders, 'Órdenes obtenidas exitosamente'));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al obtener órdenes', error));
  }
};

/* ============================================================
   GET USER ORDERS
============================================================ */
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

/* ============================================================
   UPDATE ORDER STATUS + EMAIL WHEN DELIVERED
============================================================ */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase();
    const userRole = req.user?.role || 'USER';
    const { status } = req.body;

    if (!status) {
      return res.status(400).json(errorResponse(400, 'El campo status es requerido'));
    }

    const updatedOrder = await updateOrderStatusUseCase.execute(
      req.params.id,
      status,
      userRole
    );

    if (status === 'ENTREGADO') {
      const user = await UserModel.findById(updatedOrder.userId);

      if (user && user.email) {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_TEMPLATE_ID!,
          {
            email_type: 'ORDER_DELIVERED',
            to_email: user.email,
            user_name: user.name || 'Usuario',
            order_number: updatedOrder.orderNumber,
            order_total: updatedOrder.total,
            delivery_date: new Date().toLocaleDateString('es-CO'),
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );
      }
    }

    res.json(successResponse(updatedOrder, 'Estado de orden actualizado exitosamente'));
  } catch (error: any) {
    res.status(400).json(errorResponse(400, 'Error al actualizar estado de orden', error.message || error));
  }
};

/* ============================================================
   AUTO CANCEL ORDERS
============================================================ */
export const processAutoCancelOrders = async (req: Request, res: Response) => {
  try {
    const autoCancelUseCase = new AutoCancelPendingOrdersUseCase();
    const processedCount = await autoCancelUseCase.execute();

    res.json(successResponse(processedCount, `Se procesaron ${processedCount} órdenes canceladas automáticamente`));
  } catch (error) {
    res.status(500).json(errorResponse(500, 'Error al procesar cancelación automática', error));
  }
};

/* ============================================================
   GET ORDERS BY USER (simple)
============================================================ */
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
