import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';
import { NotificationRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/NotificationRepositoryMongo';
import { OrderStatus } from '../../../domain/orders/entities/Order';

export class UpdateOrderStatusUseCase {
  private orderRepository: OrderRepositoryMongo;
  private notificationRepository: NotificationRepositoryMongo;

  constructor() {
    this.orderRepository = new OrderRepositoryMongo();
    this.notificationRepository = new NotificationRepositoryMongo();
  }

  async execute(
    orderId: string, 
    newStatus: OrderStatus, 
    userRole: string
  ): Promise<any> {
    if (!['ADMIN', 'VENDOR'].includes(userRole)) {
      throw new Error('Solo administradores y vendedores pueden actualizar estados de órdenes');
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    if (order.status === 'CANCELADO' || order.status === 'ENTREGADO') {
      throw new Error(`No se puede cambiar el estado de una orden ${order.status}`);
    }

    if (!this.isValidStatusTransition(order.status, newStatus)) {
      throw new Error(`No se puede cambiar de ${order.status} a ${newStatus}`);
    }

    const updatedOrder = await this.orderRepository.update(orderId, { 
      status: newStatus 
    });

    await this.notificationRepository.create({
      userId: order.userId,
      title: 'Actualización de Orden',
      message: `Su orden ${order.orderNumber} ha cambiado a estado: ${newStatus}`,
      type: 'ORDER_STATUS',
      isRead: false,
      relatedEntityId: orderId,
      relatedEntityType: 'order'
    });

    return updatedOrder;
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: { [key in OrderStatus]: OrderStatus[] } = {
      'PENDIENTE': ['PREPARANDO', 'CANCELADO'],
      'PREPARANDO': ['EN_TRANSITO', 'CANCELADO'],
      'EN_TRANSITO': ['EN_ENTREGA', 'CANCELADO'],
      'EN_ENTREGA': ['ENTREGADO', 'CANCELADO'],
      'ENTREGADO': [],
      'CANCELADO': []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
