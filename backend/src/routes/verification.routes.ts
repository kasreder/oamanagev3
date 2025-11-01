import { Router } from 'express';

import { verificationController } from '@/controllers/verification.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.post('/:uid/signatures', requireAuth, (req, res, next) => {
  req.body.assetUid = req.params.uid;
  return verificationController.uploadSignature(req, res, next);
});

router.get('/:uid/signatures/latest', requireAuth, (req, res, next) =>
  verificationController.getLatest(req, res, next)
);

export const buildVerificationRouter = () => router;
