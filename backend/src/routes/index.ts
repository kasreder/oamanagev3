import { Router } from 'express';

import { authApiLimiter, publicApiLimiter } from '../middlewares/rate-limit.middleware';
import healthRouter from './health.routes';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authApiLimiter);
router.use('/assets', publicApiLimiter);

export default router;
