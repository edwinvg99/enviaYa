import { Request, Response } from 'express';
import { CartRepositoryMongo } from '../../persistence/mongo/repositories/CartRepositoryMongo';
import { OrderRepositoryMongo } from '../../persistence/mongo/repositories/OrderRepositoryMongo';
import { ProductModel } from '../../../infrastructure/persistence/data/models/ProductModel';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/nodejs'; 
import { UserModel } from '../../persistence/data/models/UserModel';

const cartRepo = new CartRepositoryMongo();
const orderRepo = new OrderRepositoryMongo();

const SHIPPING_COST = 10000;
const FREE_SHIPPING_THRESHOLD = 50000;

export const confirmCheckout = async (req: Request, res: Response) => {
  try {
    const { userId, shippingData, paymentMethod } = req.body;

    if (!userId || !shippingData || !paymentMethod) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const cart = await cartRepo.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío o no existe' });
    }

    const requiredFields = ['street', 'city', 'state', 'postalCode', 'country'];
    for (const f of requiredFields) {
      if (!shippingData[f]) {
        return res.status(400).json({ message: `Campo faltante: ${f}` });
      }
    }

    let subtotal = 0;
    for (const item of cart.items) {
      const product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `No hay suficiente stock para el producto ${product.name}`
        });
      }

      subtotal += item.price * item.quantity;
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shippingCost;

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${uuidv4().slice(0, 5).toUpperCase()}`;

    const newOrder = {
      orderNumber,
      userId,
      items: cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.price,
        price: i.price,
        subtotal: i.price * i.quantity
      })),
      subtotal,
      shippingCost,
      total,
      shippingAddress: {
        street: shippingData.street,
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.postalCode,
        country: shippingData.country
      },
      paymentMethod,
      paymentStatus: 'PENDING',
      status: 'PENDIENTE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const savedOrder = await orderRepo.create(newOrder as any);

    for (const item of cart.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    await cartRepo.clearCart(userId);

    
    try {
      const user = await UserModel.findById(userId);
      if (user?.email) {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_ORDER_TEMPLATE_ID!,
          {
            to_email: user.email,
            to_name: user.name || 'Cliente',
            order_number: savedOrder?.orderNumber ?? 'N/A',
            total: savedOrder?.total ? savedOrder.total.toFixed(2) : '0.00',
            order_date: savedOrder?.createdAt
              ? new Date(savedOrder.createdAt as Date).toLocaleString()
              : new Date().toLocaleString(),
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );

        console.log(`Correo de confirmación enviado a ${user.email}`);
      } else {
        console.warn('usuario no encontrado o sin email para enviar confirmación.');
      }
    } catch (emailError) {
      console.error('Error al enviar el correo de confirmación:', emailError);
    }


    return res.status(201).json({
      message: 'Checkout completado con éxito y correo enviado',
      order: savedOrder
    });

  } catch (error: any) {
    console.error('Error en el proceso de checkout:', error);
    res.status(500).json({ message: 'Error en el proceso de checkout' });
  }
};

