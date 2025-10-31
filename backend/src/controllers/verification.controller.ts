import type { Request, Response } from 'express';

import { verificationRepository } from '@/repositories/verification.repository';
import { notFound } from '@/utils/errors';

export const listVerifications = (_req: Request, res: Response): void => {
  res.json({ items: verificationRepository.list() });
};

export const getVerification = (req: Request, res: Response): void => {
  const summary = verificationRepository.findByAssetUid(req.params.assetUid);
  if (!summary) {
    throw notFound('verification', req.params.assetUid);
  }

  res.json({
    ...summary,
    signatureMeta: summary.signature
      ? { id: 303, storageLocation: `https://example.com/signatures/${summary.assetUid}.png` }
      : null
  });
};

export const uploadSignature = (req: Request, res: Response): void => {
  res.status(201).json({
    signatureId: 303,
    storageLocation: 'https://example.com/signatures/303.png',
    uploadedAt: new Date().toISOString(),
    user: { id: req.body.userId, name: req.body.userName }
  });
};

export const batchUpdate = (req: Request, res: Response): void => {
  const { assetUids } = req.body;
  res.json({
    processed: Array.isArray(assetUids) ? assetUids.length : 0,
    synced: true
  });
};
