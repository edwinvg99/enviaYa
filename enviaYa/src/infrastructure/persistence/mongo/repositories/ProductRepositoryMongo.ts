import { IProduct } from "../../../../domain/products/entities/Product";
import { ProductModel } from "../../data/models/ProductModel";

export class ProductRepositoryMongo {
  async findAll(filters: any, page: number, limit: number): Promise<IProduct[]> {
    const query: any = { isActive: true, stock: { $gt: 0 }, isDiscontinued: { $ne: true } };

    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.category) query.category = filters.category;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    const skip = (page - 1) * limit;
    const products = await ProductModel.find(query).skip(skip).limit(limit);

    return products.map((p: any) => ({
      ...p.toObject(),
      price: parseFloat(p.price.toFixed(2)),
    }));
  }

  async findById(id: string): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findById(id);
      return product ? product.toObject() as IProduct : null;
    } catch (error) {
      console.error('Error al buscar producto por ID:', error);
      throw new Error('Error al buscar el producto');
    }
  }

  async create(productData: IProduct): Promise<IProduct> {
    try {
      const product = new ProductModel(productData);
      const savedProduct = await product.save();
      return savedProduct.toObject() as IProduct;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new Error('No se pudo crear el producto');
    }
  }

  async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id, 
        productData, 
        { new: true, runValidators: true }
      );
      return updatedProduct ? updatedProduct.toObject() as IProduct : null;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw new Error('No se pudo actualizar el producto');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw new Error('No se pudo eliminar el producto');
    }
  }

  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) return null;

      const newStock = product.stock + quantity;
      if (newStock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      product.stock = newStock;
      await product.save();
      return product.toObject() as IProduct;
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  }

  async findByCategory(categoryId: string): Promise<IProduct[]> {
    try {
      const products = await ProductModel.find({ category: categoryId, isActive: true });
      return products.map(p => p.toObject() as IProduct);
    } catch (error) {
      console.error('Error al buscar productos por categoría:', error);
      throw new Error('Error al buscar productos por categoría');
    }
  }

  async countProductsInCategory(categoryId: string): Promise<number> {
    try {
      return await ProductModel.countDocuments({ category: categoryId, isActive: true });
    } catch (error) {
      console.error('Error al contar productos en categoría:', error);
      throw new Error('Error al contar productos en categoría');
    }
  }

  async countProductsBySupplier(supplierId: string): Promise<number> {
    try {
      return await ProductModel.countDocuments({ supplier: supplierId, isActive: true });
    } catch (error) {
      console.error('Error al contar productos por proveedor:', error);
      throw new Error('Error al contar productos por proveedor');
    }
  }
}
