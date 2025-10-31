import { Router } from 'express';

import { listAssets, getAsset, upsertAsset } from '@/controllers/asset.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', listAssets);
router.get('/:uid', getAsset);
router.post('/', upsertAsset);

export default router;
