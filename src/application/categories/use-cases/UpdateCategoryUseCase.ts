import { CategoryRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/CategoryRepositoryMongo';
import { Category } from '../../../domain/categories/entities/Category';

export class UpdateCategoryUseCase {
  private categoryRepository: CategoryRepositoryMongo;

  constructor() {
    this.categoryRepository = new CategoryRepositoryMongo();
  }

  async execute(id: string, categoryData: Partial<Category>, userRole: string): Promise<Category | null> {
    // Solo administradores pueden actualizar categorías
    if (userRole !== 'ADMIN') {
      throw new Error('Solo los administradores pueden actualizar categorías');
    }

    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Categoría no encontrada');
    }

    // Validar nombre si se está actualizando
    if (categoryData.name !== undefined) {
      if (!categoryData.name || categoryData.name.trim().length === 0) {
        throw new Error('El nombre de la categoría no puede estar vacío');
      }

      // Verificar que el nombre no esté duplicado (excepto para la misma categoría)
      const duplicateName = await this.categoryRepository.findByName(categoryData.name);
      if (duplicateName && duplicateName._id !== id) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
    }

    // Validar descripción si se está actualizando
    if (categoryData.description !== undefined) {
      if (!categoryData.description || categoryData.description.trim().length === 0) {
        throw new Error('La descripción de la categoría no puede estar vacía');
      }
    }

    return await this.categoryRepository.update(id, categoryData);
  }
}
