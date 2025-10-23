import { Cart } from '../../../../domain/cartUser/entities/Cart';
import { CartModel } from '../../data/models/CartModel';
import { ProductModel } from '../../data/models/ProductModel';
import { Document } from 'mongoose';

export type CartDoc = Omit<Cart, '_id'> & Document;

export class CartRepositoryMongo {
  // carrito por usuario
  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await CartModel.findOne({ userId });
    return cart ? (cart.toObject() as Cart) : null;
  }

  // Crear nuevo carrito
  async create(cart: Cart): Promise<Cart> {
    const newCart = new CartModel(cart);
    const saved = await newCart.save();
    return saved.toObject() as Cart;
  }

  // Actualizar carrito existente
  async update(userId: string, cartData: Partial<Cart>): Promise<Cart | null> {
    const updated = await CartModel.findOneAndUpdate(
      { userId },
      cartData,
      { new: true, runValidators: true }
    );
    return updated ? (updated.toObject() as Cart) : null;
  }

  // Añadir producto al carrito y reservar stock
  async addProduct(userId: string, productId: string, quantity: number): Promise<Cart> {
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    // Verifica stock antes de reservar
    if (product.stock < quantity) throw new Error('Stock insuficiente');

    // Reserva de stock (descuento temporal)
    await ProductModel.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [],
        total: 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // +24h
      });
    }

    const existingItem = cart.items.find((i: any) => i.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        addedAt: new Date(),
        priceLockedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2h
        subtotal: product.price * quantity
      });
    }

    cart.total = cart.items.reduce((sum: number, i: any) => sum + i.subtotal, 0);
    cart.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await cart.save();

    return cart.toObject() as Cart;
  }

  // eliminar producto y devolver stock
  async removeProduct(userId: string, productId: string): Promise<Cart> {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw new Error('Carrito no encontrado');

    const item = cart.items.find((i: any) => i.productId.toString() === productId);
    if (!item) throw new Error('El producto no existe en el carrito');

    // Devolver el stock reservado
    await ProductModel.findByIdAndUpdate(productId, { $inc: { stock: item.quantity } });

    // Eliminar el producto del carrito
    cart.items = cart.items.filter((i: any) => i.productId.toString() !== productId);
    cart.total = cart.items.reduce((sum: number, i: any) => sum + i.subtotal, 0);

    // Si ya no hay items, se elimina todo el carrito
    if (cart.items.length === 0) {
      await CartModel.deleteOne({ userId });
      return cart.toObject() as Cart;
    }

    await cart.save();
    return cart.toObject() as Cart;
  }

  // Vaciar carrito completamente y liberar stock
  async clearCart(userId: string): Promise<void> {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return;

    // Devolver el stock de todos los productos
    for (const item of cart.items) {
      await ProductModel.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    await CartModel.deleteOne({ userId });
  }
}


