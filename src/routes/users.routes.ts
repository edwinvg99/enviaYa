// Rutas de usuarios
import { Router } from 'express';
import { registerUser, getUsers, loginUser, getUserById } from '../controllers/users.controller';
import { validateUser } from '../middlewares/validators';

const router = Router();

router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
