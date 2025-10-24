import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { IProduct } from '../../../domain/products/entities/Product';

export class CreateProductUseCase {
  private productRepository: ProductRepositoryMongo;

  constructor() {
    this.productRepository = new ProductRepositoryMongo();
  }

  async execute(productData: IProduct, userRole: string): Promise<IProduct> {
    if (userRole !== 'ADMIN') {
      throw new Error('Solo los administradores pueden crear productos');
    }

    if (productData.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (productData.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    return await this.productRepository.create(productData);
  }
}
