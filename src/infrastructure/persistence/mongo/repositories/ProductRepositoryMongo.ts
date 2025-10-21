import { IProduct } from "../../../../domain/products/entities/Product";
import { ProductModel } from "../../data/mock/models/ProductModel";


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
}
