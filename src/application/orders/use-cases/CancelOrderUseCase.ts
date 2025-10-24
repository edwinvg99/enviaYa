import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { NotificationRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/NotificationRepositoryMongo';

export class CancelOrderUseCase {
  private orderRepository: OrderRepositoryMongo;
  private productRepository: ProductRepositoryMongo;
  private notificationRepository: NotificationRepositoryMongo;

  constructor() {
    this.orderRepository = new OrderRepositoryMongo();
    this.productRepository = new ProductRepositoryMongo();
    this.notificationRepository = new NotificationRepositoryMongo();
  }

  async execute(orderId: string, userRole: string, reason?: string): Promise<boolean> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    if (order.status !== 'PENDIENTE') {
      throw new Error('Solo las órdenes en estado PENDIENTE pueden cancelarse');
    }

    if (!['ADMIN', 'VENDOR'].includes(userRole)) {
      throw new Error('No tienes permisos para cancelar esta orden');
    }

    await this.orderRepository.update(orderId, { 
      status: 'CANCELADO',
      notes: reason ? `Cancelada: ${reason}` : 'Orden cancelada'
    });

    for (const item of order.items) {
      await this.productRepository.updateStock(item.productId, item.quantity);
    }

    await this.notificationRepository.create({
      userId: order.userId,
      title: 'Orden Cancelada',
      message: `Su orden ${order.orderNumber} ha sido cancelada. ${reason || 'El stock ha sido devuelto automáticamente.'}`,
      type: 'ORDER_CANCELLED',
      isRead: false
    });

    return true;
  }
}
