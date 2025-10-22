import { CategoryRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/CategoryRepositoryMongo';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/ProductRepositoryMongo';
import { Category } from '../../../domain/categories/entities/Category';

export class CreateCategoryUseCase {
  private categoryRepository: CategoryRepositoryMongo;

  constructor() {
    this.categoryRepository = new CategoryRepositoryMongo();
  }

  async execute(categoryData: Category, userRole: string): Promise<Category> {
    // Solo administradores pueden crear categorías
    if (userRole !== 'ADMIN') {
      throw new Error('Solo los administradores pueden crear categorías');
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.categoryRepository.findByName(categoryData.name);
    if (existingCategory) {
      throw new Error('Ya existe una categoría con ese nombre');
    }

    return await this.categoryRepository.create(categoryData);
  }
}
