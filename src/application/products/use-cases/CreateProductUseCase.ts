import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { IProduct } from '../../../domain/products/entities/Product';

export class CreateProductUseCase {
  private productRepository: ProductRepositoryMongo;

  constructor() {
    this.productRepository = new ProductRepositoryMongo();
  }

  async execute(productData: IProduct, userRole: string): Promise<IProduct> {
    // Solo administradores pueden crear productos
    if (userRole !== 'ADMIN') {
      throw new Error('Solo los administradores pueden crear productos');
    }

    // Validar que el stock no sea negativo
    if (productData.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Validar que el precio sea positivo
    if (productData.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    return await this.productRepository.create(productData);
  }
}
