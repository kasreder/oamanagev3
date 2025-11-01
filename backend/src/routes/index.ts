import { Express, Router } from 'express';

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

  app.use(prefix, router);
};
