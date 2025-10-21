// Rutas de productos
import { Router } from 'express';
import { getProducts} from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
/*outer.post('/', createProduct);
router.get('/:id', getProductById);*/

export default router;
