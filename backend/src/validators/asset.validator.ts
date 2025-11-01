import Joi from 'joi';

import { Asset, AssetFilters } from '@/models/Asset';
import { UserSummary } from '@/models/User';
import { HttpError } from '@/middlewares/error.middleware';

const assetFiltersSchema = Joi.object({
  q: Joi.string().optional(),
  status: Joi.string().optional(),
  team: Joi.string().optional(),
  page: Joi.number().integer().min(0).optional(),
  pageSize: Joi.number().integer().min(1).max(100).optional(),
});

const userSummarySchema = Joi.object<UserSummary>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
});

const assetPayloadSchema = Joi.object<Asset>({
  uid: Joi.string().max(64).required(),
  name: Joi.string().allow(null).optional(),
  assetType: Joi.string().allow(null).optional(),
  modelName: Joi.string().allow(null).optional(),
  serialNumber: Joi.string().allow(null).optional(),
  vendor: Joi.string().allow(null).optional(),
  status: Joi.string().default('사용'),
  location: Joi.object({
    text: Joi.string().allow(null).optional(),
    building: Joi.string().allow(null).optional(),
    floor: Joi.string().allow(null).optional(),
    row: Joi.number().integer().allow(null).optional(),
    col: Joi.number().integer().allow(null).optional(),
  }).default({}),
  owner: userSummarySchema.allow(null).optional(),
  metadata: Joi.object().unknown(true).allow(null).optional(),
  createdAt: Joi.string().optional(),
  updatedAt: Joi.string().optional(),
}).unknown(false);

export const parseAssetFilters = (query: unknown): AssetFilters => {
  const { value, error } = assetFiltersSchema.validate(query, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '필터 유효성 검증에 실패했습니다.', error.details);
  }

  return value as AssetFilters;
};

export const parseAssetPayload = (payload: unknown): Asset => {
  const { value, error } = assetPayloadSchema.validate(payload, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '자산 데이터 유효성 검증에 실패했습니다.', error.details);
  }

  return value as Asset;
};
