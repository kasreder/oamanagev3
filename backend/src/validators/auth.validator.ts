import Joi from 'joi';

import { HttpError } from '@/middlewares/error.middleware';

const socialLoginSchema = Joi.object({
  provider: Joi.string().valid('kakao', 'naver', 'google', 'teams').required(),
  providerId: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().min(10).required(),
});

export const parseSocialLoginPayload = (payload: unknown) => {
  const { value, error } = socialLoginSchema.validate(payload, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '소셜 로그인 요청이 올바르지 않습니다.', error.details);
  }

  return value as { provider: string; providerId: string };
};

export const parseRefreshPayload = (payload: unknown) => {
  const { value, error } = refreshSchema.validate(payload, { stripUnknown: true });

  if (error) {
    throw new HttpError(400, '리프레시 토큰이 유효하지 않습니다.', error.details);
  }

  return value as { refreshToken: string };
};
