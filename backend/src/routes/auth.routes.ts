import { Router } from 'express';

import { credentialLogin, logout, refreshToken, socialLogin } from '@/controllers/auth.controller';

const router = Router();

router.post('/social/:provider', socialLogin);
router.post('/login', credentialLogin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
