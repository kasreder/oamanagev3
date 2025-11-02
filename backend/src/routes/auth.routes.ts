import { Router } from 'express';

import authController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:provider/callback', authController.socialLogin);
router.post('/social/:provider', authController.socialLogin);
router.post('/refresh', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);

export default router;
