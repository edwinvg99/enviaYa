import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';

export class DeleteProductUseCase {
  private productRepository: ProductRepositoryMongo;
  private orderRepository: OrderRepositoryMongo;

  constructor() {
    this.productRepository = new ProductRepositoryMongo();
    this.orderRepository = new OrderRepositoryMongo();
  }

  async execute(id: string, userRole: string): Promise<boolean> {
    if (userRole !== 'ADMIN') {
      throw new Error('Solo los administradores pueden eliminar productos');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    const ordersCount = await this.orderRepository.countOrdersByProduct(id);
    if (ordersCount > 0) {
      throw new Error('No se puede eliminar un producto que tiene órdenes asociadas');
    }

    return await this.productRepository.delete(id);
  }
}
