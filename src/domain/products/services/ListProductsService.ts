import { ProductModel } from "../../../infrastructure/persistence/data/mock/models/ProductModel";


export class ListProductsService {
    async execute(filters: any, page = 1, limit = 10) {
        const query: any = {
            isActive: true,
            isDiscontinued: false,
            stock: { $gt: 0 }
        };

        if (filters.search) {
            query.name = { $regex: filters.search, $options: "i" };
        }
        if (filters.category) {
            query.category = filters.category;
        }

        const skip = (page - 1) * limit;
        const products = await ProductModel.find(query)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await ProductModel.countDocuments(query);

        const formatted = products.map((p: any) => ({
            ...p,
            price: p.price.toFixed(2),
        }));


        return {
            page,
            limit,
            total,
            data: formatted
        };
    }
}

