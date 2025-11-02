import { Router } from 'express';

import { authApiLimiter, publicApiLimiter } from '../middlewares/rate-limit.middleware';
import authRouter from './auth.routes';
import healthRouter from './health.routes';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authApiLimiter, authRouter);
router.use('/assets', publicApiLimiter);

export default router;
