import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';

export class UpdateStockUseCase {
  private productRepository: ProductRepositoryMongo;

  constructor() {
    this.productRepository = new ProductRepositoryMongo();
  }

  async execute(id: string, quantity: number, userRole: string): Promise<any> {
    if (!['ADMIN', 'VENDOR'].includes(userRole)) {
      throw new Error('Solo administradores y vendedores pueden actualizar el stock');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    const newStock = existingProduct.stock + quantity;
    if (newStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return await this.productRepository.updateStock(id, quantity);
  }
}
