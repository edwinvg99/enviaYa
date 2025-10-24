import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { UserRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/UserRepositoryMongo';
import { Order } from '../../../domain/orders/entities/Order';

export class CreateOrderUseCase {
  private orderRepository: OrderRepositoryMongo;
  private productRepository: ProductRepositoryMongo;
  private userRepository: UserRepositoryMongo;

  constructor() {
    this.orderRepository = new OrderRepositoryMongo();
    this.productRepository = new ProductRepositoryMongo();
    this.userRepository = new UserRepositoryMongo();
  }

  async execute(orderData: Order): Promise<Order> {
    const user = await this.userRepository.findById(orderData.userId);
    if (!user) {
      throw new Error(`Usuario con ID ${orderData.userId} no encontrado`);
    }

    const orderNumber = this.generateOrderNumber();

    for (const item of orderData.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto ${product.name}`);
      }
    }

    let subtotal = 0;
    for (const item of orderData.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        item.unitPrice = product.price;
        item.price = product.price * item.quantity;
        item.subtotal = item.price;
        subtotal += item.subtotal;
      }
    }

    orderData.subtotal = subtotal;
    orderData.total = subtotal + (orderData.shippingCost || 0);
    orderData.orderNumber = orderNumber;
    orderData.status = 'PENDIENTE';

    const order = await this.orderRepository.create(orderData);

    // Reducir stock de productos
    for (const item of order.items) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }

    return order;
  }

  private generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }
}
