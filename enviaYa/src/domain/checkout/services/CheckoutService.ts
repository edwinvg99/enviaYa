import { CartRepositoryMongo } from "../../../infrastructure/persistence/mongo/repositories/CartRepositoryMongo";
import { OrderRepositoryMongo } from "../../../infrastructure/persistence/mongo/repositories/OrderRepositoryMongo";
import { ProductModel } from "../../../infrastructure/persistence/data/models/ProductModel";
import { Order } from "../../orders/entities/Order";


export class CheckoutService {
  private cartRepo = new CartRepositoryMongo();
  private orderRepo = new OrderRepositoryMongo();

  async execute(userId: string, shippingData: any, paymentMethod: string): Promise<Order> {
    // Obtener carrito
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error("El carrito está vacío o no existe.");
    }

    // Verificar expiración
    if (cart.expiresAt < new Date()) {
      throw new Error("El carrito ha expirado. Por favor, agrega los productos nuevamente.");
    }

    // Validación mínima: existencia de productos; el stock ya fue reservado al agregar al carrito
    for (const item of cart.items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        throw new Error(`El producto ${item.name} ya no existe.`);
      }
    }

    // Calcular envío (gratis si total >= 50000)
    const shippingCost = cart.total >= 50000 ? 0 : 8000;
    const total = cart.total + shippingCost;

    // Crear número de orden único
    const now = new Date();
    const unique = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${unique}`;

    // Crear orden
    const newOrder: Order = {
  orderNumber,
  userId,
  status: "PENDIENTE",
  items: cart.items.map((i: any) => ({
    productId: i.productId,
    quantity: i.quantity,
    unitPrice: i.price,
    subtotal: i.price * i.quantity,
  })),
  subtotal: cart.total,
  shippingCost,
  total,
  shippingAddress: shippingData,
  paymentMethod,
  paymentStatus: "PENDING",
  createdAt: new Date(),
};


    const savedOrder = await this.orderRepo.create(newOrder);

    // No descontar stock aquí: ya se reservó al agregar al carrito
    // Limpiar carrito sin reponer stock
    await this.cartRepo.clearCart(userId, { restock: false });

    return savedOrder;
  }
}
