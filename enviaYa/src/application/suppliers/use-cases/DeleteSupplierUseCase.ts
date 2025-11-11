import { SupplierRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/SupplierRepositoryMongo';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';

export class DeleteSupplierUseCase {
  private supplierRepository: SupplierRepositoryMongo;
  private productRepository: ProductRepositoryMongo;

  constructor() {
    this.supplierRepository = new SupplierRepositoryMongo();
    this.productRepository = new ProductRepositoryMongo();
  }

  async execute(id: string, userRole: string): Promise<boolean> {
    if (userRole?.trim() !== 'ADMIN') {
      throw new Error('Solo los administradores pueden eliminar proveedores');
    }

    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new Error('Proveedor no encontrado');
    }

    const productsCount = await this.productRepository.countProductsBySupplier(id);
    if (productsCount > 0) {
      throw new Error('No se puede eliminar un proveedor que tiene productos asociados');
    }

    return await this.supplierRepository.delete(id);
  }
}
