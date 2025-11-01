import { NextFunction, Request, Response } from 'express';

import { assetService } from '@/services/asset.service';

export class ReferenceController {
  async assetReferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const references = await assetService.getReferences(req.query.q as string | undefined);
      res.json({ data: references });
    } catch (error) {
      next(error);
    }
  }
}

export const referenceController = new ReferenceController();
