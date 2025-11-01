import { Router } from 'express';

import { assetController } from '@/controllers/asset.controller';
import { optionalAuth } from '@/middlewares/optional-auth.middleware';
import { requireAuth } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/admin.middleware';

const router = Router();

router.get('/', optionalAuth, (req, res, next) => assetController.list(req, res, next));
router.get('/:uid', optionalAuth, (req, res, next) => assetController.getByUid(req, res, next));
router.post('/', requireAuth, (req, res, next) => assetController.upsert(req, res, next));
router.patch('/:uid', requireAuth, (req, res, next) => assetController.upsert(req, res, next));
router.delete('/:uid', requireAuth, requireAdmin, (req, res, next) => assetController.remove(req, res, next));

export const buildAssetRouter = () => router;
