import { Request, Response } from 'express';
import { CartRepositoryMongo } from '../../persistence/mongo/repositories/CartRepositoryMongo';


const cartRepo = new CartRepositoryMongo();

// ✅ Añadir producto al carrito
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || '6732e6f2a45a7a72bc0b1234'; // temporal, cámbialo cuando haya autenticación
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const cart = await cartRepo.addProduct(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (error: any) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ✅ Obtener carrito
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId?.toString() || '6732e6f2a45a7a72bc0b1234';
    const cart = await cartRepo.findByUserId(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito' });
  }
};

// ✅ Remover producto
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.body.userId || '6732e6f2a45a7a72bc0b1234';
    const cart = await cartRepo.removeProduct(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

// ✅ Vaciar carrito
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || '6732e6f2a45a7a72bc0b1234';
    await cartRepo.clearCart(userId);
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar carrito' });
  }
};
