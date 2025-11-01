import { NextFunction, Request, Response } from 'express';

import { signatureService } from '@/services/signature.service';
import { parseSignaturePayload } from '@/validators/signature.validator';

export class VerificationController {
  async uploadSignature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = parseSignaturePayload(req.body, req.user);
      await signatureService.createSignature(payload);
      res.status(201).json({ data: payload.assetUid });
    } catch (error) {
      next(error);
    }
  }

  async getLatest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = await signatureService.getLatestForAsset(req.params.uid);
      res.json({ data: signature });
    } catch (error) {
      next(error);
    }
  }
}

export const verificationController = new VerificationController();
