import { Category } from "../../../../domain/categories/entities/Category";
import { CategoryModel } from "../../data/models/CategoryModel";

export class CategoryRepositoryMongo {
  async findAll(): Promise<Category[]> {
    try {
      const categories = await CategoryModel.find({ active: true });
      return categories.map(c => c.toObject() as Category);
    } catch (error) {
      console.error('Error al buscar categorías:', error);
      throw new Error('Error al buscar categorías');
    }
  }

  async findById(id: string): Promise<Category | null> {
    try {
      const category = await CategoryModel.findById(id);
      return category ? category.toObject() as Category : null;
    } catch (error) {
      console.error('Error al buscar categoría por ID:', error);
      throw new Error('Error al buscar la categoría');
    }
  }

  async create(categoryData: Category): Promise<Category> {
    try {
      const category = new CategoryModel(categoryData);
      const savedCategory = await category.save();
      return savedCategory.toObject() as Category;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new Error('No se pudo crear la categoría');
    }
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id, 
        categoryData, 
        { new: true, runValidators: true }
      );
      return updatedCategory ? updatedCategory.toObject() as Category : null;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw new Error('No se pudo actualizar la categoría');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await CategoryModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw new Error('No se pudo eliminar la categoría');
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      return category ? category.toObject() as Category : null;
    } catch (error) {
      console.error('Error al buscar categoría por nombre:', error);
      throw new Error('Error al buscar la categoría');
    }
  }
}
