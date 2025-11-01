import { Router } from 'express';

import { authController } from '@/controllers/auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/social/:provider', (req, res, next) => authController.socialLogin(req, res, next));
router.post('/social', (req, res, next) => authController.socialLogin(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', requireAuth, (req, res, next) => authController.logout(req, res, next));

export const buildAuthRouter = () => router;
