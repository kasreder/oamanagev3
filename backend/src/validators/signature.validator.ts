import Joi from 'joi';

import { Signature } from '@/models/Signature';
import { AuthenticatedUser } from '@/types/api.types';
import { HttpError } from '@/middlewares/error.middleware';

const signatureSchema = Joi.object<Omit<Signature, 'id'>>({
  assetUid: Joi.string().max(64).required(),
  userId: Joi.number().integer().positive().optional(),
  userName: Joi.string().allow(null).optional(),
  storageLocation: Joi.string().required(),
  fileSize: Joi.number().integer().min(0).allow(null).optional(),
  mimeType: Joi.string().default('image/png'),
  sha256: Joi.string().length(64).hex().allow(null).optional(),
  capturedAt: Joi.string().isoDate().required(),
});

export const parseSignaturePayload = (
  payload: unknown,
  user?: AuthenticatedUser | null
): Omit<Signature, 'id'> => {
  const { value, error } = signatureSchema.validate(payload, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '서명 데이터가 올바르지 않습니다.', error.details);
  }

  const parsed = value as Omit<Signature, 'id'>;

  if (!parsed.userId && user) {
    return { ...parsed, userId: user.id, userName: user.name ?? null };
  }

  return parsed;
};
