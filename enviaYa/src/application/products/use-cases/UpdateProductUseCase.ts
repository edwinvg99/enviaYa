import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo';
import { IProduct } from '../../../domain/products/entities/Product';

export class UpdateProductUseCase {
  private productRepository: ProductRepositoryMongo;
  private orderRepository: OrderRepositoryMongo;

  constructor() {
    this.productRepository = new ProductRepositoryMongo();
    this.orderRepository = new OrderRepositoryMongo();
  }

  async execute(id: string, productData: Partial<IProduct>, userRole: string): Promise<IProduct | null> {
    if (!['ADMIN', 'VENDOR'].includes(userRole)) {
      throw new Error('Solo los administradores y vendedores pueden actualizar productos');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (productData.price !== undefined && productData.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    return await this.productRepository.update(id, productData);
  }
}
