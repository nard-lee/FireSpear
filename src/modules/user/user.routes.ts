import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { userController } from './user.controller.js';

const router = Router();

router.get('/users', authMiddleware, userController.showUsers.bind(userController));

export default router;