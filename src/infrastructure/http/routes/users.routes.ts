import { Router } from 'express';
import { registerUser, loginUser, verifyUserEmail} from '../controllers/users.controller';
import { validateUser } from '../middlewares/validators';

const router = Router();

router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyUserEmail);

export default router;


