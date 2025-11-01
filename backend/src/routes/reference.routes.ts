import { Router } from 'express';

import { referenceController } from '@/controllers/reference.controller';
import { optionalAuth } from '@/middlewares/optional-auth.middleware';

const router = Router();

router.get('/assets', optionalAuth, (req, res, next) => referenceController.assetReferences(req, res, next));

export const buildReferenceRouter = () => router;
