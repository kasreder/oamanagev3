import { Router } from 'express';

import { inspectionController } from '@/controllers/inspection.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, (req, res, next) => inspectionController.listByAsset(req, res, next));
router.post('/', requireAuth, (req, res, next) => inspectionController.create(req, res, next));
router.patch('/:id', requireAuth, (req, res, next) => inspectionController.update(req, res, next));
router.delete('/:id', requireAuth, (req, res, next) => inspectionController.remove(req, res, next));

export const buildInspectionRouter = () => router;
