import { Router } from 'express';

import authController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/kakao/callback', authController.kakaoCallback);
router.get('/naver/callback', authController.naverCallback);
router.get('/google/callback', authController.googleCallback);
router.get('/teams/callback', authController.teamsCallback);
router.post('/social/:provider', authController.socialLogin);
router.post('/refresh', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);

export default router;
