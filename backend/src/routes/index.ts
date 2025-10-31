import { Router } from 'express';

import authRoutes from '@/routes/auth.routes';
import assetRoutes from '@/routes/asset.routes';
import referenceRoutes from '@/routes/reference.routes';
import userRoutes from '@/routes/user.routes';
import verificationRoutes from '@/routes/verification.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/verifications', verificationRoutes);
router.use('/references', referenceRoutes);
router.use('/users', userRoutes);

export default router;
