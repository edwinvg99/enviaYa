import { Router } from 'express';
import { confirmCheckout } from '../controllers/checkout.controller';

const router = Router();

router.post('/confirm', confirmCheckout);

export default router;

