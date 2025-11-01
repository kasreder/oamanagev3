import { NextFunction, Request, Response } from 'express';

import { inspectionService } from '@/services/inspection.service';
import {
  parseInspectionCreatePayload,
  parseInspectionUpdatePayload,
} from '@/validators/inspection.validator';

export class InspectionController {
  async listByAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assetUid = req.query.assetUid as string | undefined;

      if (!assetUid) {
        res.status(400).json({ error: 'VALIDATION_ERROR', message: 'assetUid is required' });
        return;
      }

      const inspections = await inspectionService.listByAsset(assetUid);
      res.json({ data: inspections });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = parseInspectionCreatePayload(req.body);
      await inspectionService.createInspection(payload);
      res.status(201).json({ data: payload.id });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updates = parseInspectionUpdatePayload(req.body);
      await inspectionService.updateInspection(req.params.id, updates);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await inspectionService.deleteInspection(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const inspectionController = new InspectionController();
