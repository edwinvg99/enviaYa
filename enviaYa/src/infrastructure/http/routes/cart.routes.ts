import { Router } from 'express';
import { addToCart, removeFromCart, getCart, clearCart } from '../../../infrastructure/http/controllers/cart.controller';

const router = Router();

router.post('/add', addToCart);
router.delete('/remove', removeFromCart);
router.get('/', getCart);
router.delete('/clear', clearCart);

export default router;
