import { NextFunction, Request, Response } from 'express';

import { assetService } from '@/services/asset.service';
import { parseAssetFilters, parseAssetPayload } from '@/validators/asset.validator';

export class AssetController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = parseAssetFilters(req.query);
      const result = await assetService.listAssets(filters, req.user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getByUid(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const asset = await assetService.getAsset(req.params.uid, req.user);

      if (!asset) {
        res.status(404).json({ error: 'ASSET_NOT_FOUND' });
        return;
      }

      res.json({ data: asset });
    } catch (error) {
      next(error);
    }
  }

  async upsert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const asset = parseAssetPayload({ ...req.body, uid: req.params.uid ?? req.body?.uid });
      await assetService.upsertAsset(asset);
      res.status(201).json({ data: asset.uid });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await assetService.deleteAsset(req.params.uid);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const assetController = new AssetController();
