import { CategoryRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/CategoryRepositoryMongo';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';

export class DeleteCategoryUseCase {
  private categoryRepository: CategoryRepositoryMongo;
  private productRepository: ProductRepositoryMongo;

  constructor() {
    this.categoryRepository = new CategoryRepositoryMongo();
    this.productRepository = new ProductRepositoryMongo();
  }

  async execute(id: string, userRole: string): Promise<boolean> {
    // Solo administradores pueden eliminar categorías
    if (userRole !== 'ADMIN') {
      throw new Error('Solo los administradores pueden eliminar categorías');
    }

    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Categoría no encontrada');
    }

    // Verificar si la categoría tiene productos activos
    const productsCount = await this.productRepository.countProductsInCategory(id);
    if (productsCount > 0) {
      throw new Error('No se puede eliminar una categoría que tiene productos activos');
    }

    return await this.categoryRepository.delete(id);
  }
}
