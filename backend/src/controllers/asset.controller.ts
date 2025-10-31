import type { Request, Response } from 'express';

import { assetRepository } from '@/repositories/asset.repository';
import { invalidInput, notFound } from '@/utils/errors';

export const listAssets = (req: Request, res: Response): void => {
  const { q, status, team, page = '0', pageSize = '20' } = req.query;
  const response = assetRepository.list({
    q: q?.toString(),
    status: status?.toString(),
    team: team?.toString(),
    page: Number(page),
    pageSize: Number(pageSize)
  });
  res.json(response);
};

export const getAsset = (req: Request, res: Response): void => {
  const asset = assetRepository.findByUid(req.params.uid);
  if (!asset) {
    throw notFound('asset', req.params.uid);
  }

  res.json({ ...asset, history: [] });
};

export const upsertAsset = (req: Request, res: Response): void => {
  const { uid } = req.body;
  if (!uid) {
    throw invalidInput({ reason: 'uid가 필요합니다.' });
  }

  const updated = assetRepository.upsert(req.body);
  res.status(201).json(updated);
};
