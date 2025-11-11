import { Order } from "../../../../domain/orders/entities/Order";
import { OrderModel } from "../../data/models/OrderModel";

export class OrderRepositoryMongo {
  async findAll(filters: any, page: number, limit: number): Promise<Order[]> {
    try {
      const query: any = {};
      
      if (filters.status) query.status = filters.status;
      if (filters.userId) query.userId = filters.userId;
      if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;

      const skip = (page - 1) * limit;
      const orders = await OrderModel.find(query)
        .populate('userId', 'name email')
        .populate('items.productId', 'name price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return orders.map(o => o.toObject() as Order);
    } catch (error) {
      console.error('Error al buscar órdenes:', error);
      throw new Error('Error al buscar órdenes');
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const order = await OrderModel.findById(id)
        .populate('userId', 'name email')
        .populate('items.productId', 'name price');
      return order ? order.toObject() as Order : null;
    } catch (error) {
      console.error('Error al buscar orden por ID:', error);
      throw new Error('Error al buscar la orden');
    }
  }

  async create(orderData: Order): Promise<Order> {
    try {
      const order = new OrderModel(orderData);
      const savedOrder = await order.save();
      return savedOrder.toObject() as Order;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw new Error('No se pudo crear la orden');
    }
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order | null> {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id, 
        orderData, 
        { new: true, runValidators: true }
      ).populate('userId', 'name email')
       .populate('items.productId', 'name price');
      return updatedOrder ? updatedOrder.toObject() as Order : null;
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      throw new Error('No se pudo actualizar la orden');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await OrderModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      throw new Error('No se pudo eliminar la orden');
    }
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    try {
      const order = await OrderModel.findOne({ orderNumber })
        .populate('userId', 'name email')
        .populate('items.productId', 'name price');
      return order ? order.toObject() as Order : null;
    } catch (error) {
      console.error('Error al buscar orden por número:', error);
      throw new Error('Error al buscar la orden');
    }
  }

  async findByUserId(userId: string): Promise<Order[]> {
    try {
      const orders = await OrderModel.find({ userId })
        .populate('items.productId', 'name price')
        .sort({ createdAt: -1 });
      return orders.map(o => o.toObject() as Order);
    } catch (error) {
      console.error('Error al buscar órdenes por usuario:', error);
      throw new Error('Error al buscar órdenes del usuario');
    }
  }

  async findPendingOrders(): Promise<Order[]> {
    try {
      const orders = await OrderModel.find({ status: 'PENDIENTE' })
        .populate('userId', 'name email')
        .populate('items.productId', 'name price')
        .sort({ createdAt: 1 });
      return orders.map(o => o.toObject() as Order);
    } catch (error) {
      console.error('Error al buscar órdenes pendientes:', error);
      throw new Error('Error al buscar órdenes pendientes');
    }
  }

  async findOrdersByStatus(status: string): Promise<Order[]> {
    try {
      const orders = await OrderModel.find({ status })
        .populate('userId', 'name email')
        .populate('items.productId', 'name price')
        .sort({ createdAt: -1 });
      return orders.map(o => o.toObject() as Order);
    } catch (error) {
      console.error('Error al buscar órdenes por estado:', error);
      throw new Error('Error al buscar órdenes por estado');
    }
  }

  async countOrdersByProduct(productId: string): Promise<number> {
    try {
      return await OrderModel.countDocuments({ 
        'items.productId': productId,
        status: { $ne: 'CANCELADO' }
      });
    } catch (error) {
      console.error('Error al contar órdenes por producto:', error);
      throw new Error('Error al contar órdenes por producto');
    }
  }
}
