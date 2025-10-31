import { Router } from 'express';

import { searchAssets, searchUsers } from '@/controllers/reference.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/users', searchUsers);
router.get('/assets', searchAssets);

export default router;
