import { Router } from 'express';

import { getMe, updateMe } from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/me', getMe);
router.patch('/me', updateMe);

export default router;
