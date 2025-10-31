import { Router } from 'express';

import { listVerifications, getVerification, uploadSignature, batchUpdate } from '@/controllers/verification.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', listVerifications);
router.get('/:assetUid', getVerification);
router.post('/:assetUid/signatures', uploadSignature);
router.post('/batch', batchUpdate);

export default router;
