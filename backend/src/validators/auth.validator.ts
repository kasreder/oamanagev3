import Joi from 'joi';

import { HttpError } from '../middlewares/error.middleware';

const validationOptions: Joi.ValidationOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
};

const socialLoginSchema = Joi.object({
  accessToken: Joi.string().trim().required(),
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().trim().required(),
});

const logoutSchema = Joi.object({
  refreshToken: Joi.string().trim().optional(),
});

const formatError = (error: Joi.ValidationError) =>
  error.details.map((detail) => detail.message).join(', ');

export const validateSocialLoginRequest = (payload: unknown): { accessToken: string } => {
  const { value, error } = socialLoginSchema.validate(payload, validationOptions);

  if (error) {
    throw new HttpError(
      400,
      '잘못된 요청 데이터입니다.',
      'INVALID_SOCIAL_LOGIN_REQUEST',
      formatError(error),
    );

  }

  return value as { accessToken: string };
};

export const validateRefreshTokenRequest = (payload: unknown): { refreshToken: string } => {
  const { value, error } = refreshTokenSchema.validate(payload, validationOptions);

  if (error) {
    throw new HttpError(
      400,
      'Refresh 토큰이 필요합니다.',
      'INVALID_REFRESH_TOKEN_REQUEST',
      formatError(error),
    );

  }

  return { refreshToken: value.refresh_token };
};

export const validateLogoutRequest = (payload: unknown): { refreshToken?: string } => {
  const { value, error } = logoutSchema.validate(payload ?? {}, validationOptions);

  if (error) {
    throw new HttpError(
      400,
      '로그아웃 요청이 잘못되었습니다.',
      'INVALID_LOGOUT_REQUEST',
      formatError(error),
    );

  }

  return value as { refreshToken?: string };
};

export default {
  validateSocialLoginRequest,
  validateRefreshTokenRequest,
  validateLogoutRequest,
};
