import Joi from 'joi';

import { Inspection } from '@/models/Inspection';
import { HttpError } from '@/middlewares/error.middleware';

const inspectionCreateSchema = Joi.object<Omit<Inspection, 'createdAt' | 'updatedAt'>>({
  id: Joi.string().max(64).required(),
  assetUid: Joi.string().max(64).required(),
  status: Joi.string().required(),
  memo: Joi.string().allow(null).optional(),
  scannedAt: Joi.string().isoDate().required(),
  synced: Joi.boolean().default(false),
  userTeam: Joi.string().allow(null).optional(),
  userId: Joi.number().integer().positive().allow(null).optional(),
  assetType: Joi.string().allow(null).optional(),
  verified: Joi.boolean().default(false),
  barcodePhotoUrl: Joi.string().uri().allow(null).optional(),
});

const inspectionUpdateSchema = Joi.object<Partial<Pick<Inspection, 'status' | 'memo' | 'synced' | 'verified'>>>(
  {
    status: Joi.string().optional(),
    memo: Joi.string().allow(null).optional(),
    synced: Joi.boolean().optional(),
    verified: Joi.boolean().optional(),
  }
).min(1);

export const parseInspectionCreatePayload = (
  payload: unknown
): Omit<Inspection, 'createdAt' | 'updatedAt'> => {
  const { value, error } = inspectionCreateSchema.validate(payload, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '실사 생성 요청이 올바르지 않습니다.', error.details);
  }

  return value as Omit<Inspection, 'createdAt' | 'updatedAt'>;
};

export const parseInspectionUpdatePayload = (
  payload: unknown
): Partial<Pick<Inspection, 'status' | 'memo' | 'synced' | 'verified'>> => {
  const { value, error } = inspectionUpdateSchema.validate(payload, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '실사 수정 요청이 올바르지 않습니다.', error.details);
  }

  return value as Partial<Pick<Inspection, 'status' | 'memo' | 'synced' | 'verified'>>;
};
