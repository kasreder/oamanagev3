import { Express, Router } from 'express';
import { buildAuthRouter } from './auth.routes';
import { buildAssetRouter } from './asset.routes';
import { buildInspectionRouter } from './inspection.routes';
import { buildVerificationRouter } from './verification.routes';
import { buildReferenceRouter } from './reference.routes';

const buildHealthRouter = (): Router => {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
};

export const registerRoutes = (app: Express): void => {
  const prefix = process.env.API_PREFIX || '/api/v1';
  const router = Router();

  router.use(buildHealthRouter());
  router.use('/auth', buildAuthRouter());
  router.use('/assets', buildAssetRouter());
  router.use('/inspections', buildInspectionRouter());
  router.use('/verifications', buildVerificationRouter());
  router.use('/references', buildReferenceRouter());


  app.use(prefix, router);
};
