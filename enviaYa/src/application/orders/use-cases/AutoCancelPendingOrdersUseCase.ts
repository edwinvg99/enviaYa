import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { NotificationRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/NotificationRepositoryMongo';

export class AutoCancelPendingOrdersUseCase {
  private orderRepository: OrderRepositoryMongo;
  private productRepository: ProductRepositoryMongo;
  private notificationRepository: NotificationRepositoryMongo;

  constructor() {
    this.orderRepository = new OrderRepositoryMongo();
    this.productRepository = new ProductRepositoryMongo();
    this.notificationRepository = new NotificationRepositoryMongo();
  }

  async execute(): Promise<number> {
    // Buscar órdenes pendientes por más de 48 horas
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const pendingOrders = await this.orderRepository.findOrdersByStatus('PENDIENTE');
    const overdueOrders = pendingOrders.filter(order => 
      order.createdAt && new Date(order.createdAt) < fortyEightHoursAgo
    );

    let processedCount = 0;

    for (const order of overdueOrders) {
      // Actualizar estado de la orden
      await this.orderRepository.update(order._id!, { 
        status: 'CANCELADO',
        notes: 'Orden cancelada automáticamente después de 48 horas sin procesamiento'
      });

      // Devolver stock automáticamente
      for (const item of order.items) {
        await this.productRepository.updateStock(item.productId, item.quantity);
      }

      // Crear notificación al cliente
      await this.notificationRepository.create({
        userId: order.userId,
        title: 'Orden Cancelada Automáticamente',
        message: `Su orden ${order.orderNumber} ha sido cancelada automáticamente después de 48 horas sin procesamiento. El stock ha sido devuelto.`,
        type: 'ORDER_CANCELLED',
        isRead: false
      });

      processedCount++;
    }

    return processedCount;
  }
}
