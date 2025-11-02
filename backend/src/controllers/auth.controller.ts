import { NextFunction, Request, Response } from 'express';

import {
  isSupportedProvider,
  loginWithSocial,
  logout as logoutService,
  refreshAccessToken,
} from '../services/auth.service';
import {
  validateLogoutRequest,
  validateRefreshTokenRequest,
  validateSocialLoginRequest,
} from '../validators/auth.validator';
import { HttpError } from '../middlewares/error.middleware';
import logger from '../utils/logger';
import { SocialProvider } from '../models/User';


const getSingleQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === 'string' ? value : undefined;
};

const APP_AUTH_CALLBACK_URI = process.env.APP_AUTH_CALLBACK_URI ?? 'myapp://auth/callback';

const buildAppRedirectUrl = (
  baseUri: string,
  params: Record<string, string | undefined>,
): string => {
  const filteredEntries = Object.entries(params).filter(([, value]) => Boolean(value));

  if (filteredEntries.length === 0) {
    return baseUri;
  }

  try {
    const url = new URL(baseUri);
    filteredEntries.forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch (error) {
    const query = filteredEntries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    const separator = baseUri.includes('?') ? '&' : '?';

    return `${baseUri}${separator}${query}`;
  }
};

const createOAuthCallbackHandler = (provider: SocialProvider) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = getSingleQueryValue(req.query.code);
      const state = getSingleQueryValue(req.query.state);
      const error = getSingleQueryValue(req.query.error);
      const errorDescription =
        getSingleQueryValue(req.query.error_description) ??
        getSingleQueryValue((req.query as Record<string, unknown>)['errorDescription']);
      const accessToken =
        getSingleQueryValue(req.query.access_token) ??
        getSingleQueryValue((req.query as Record<string, unknown>)['accessToken']);

      logger.info('OAuth callback received', {
        provider,
        hasCode: Boolean(code),
        hasAccessToken: Boolean(accessToken),
        error,
        state,
      });

      if (error) {
        const redirectUrl = buildAppRedirectUrl(APP_AUTH_CALLBACK_URI, {
          provider,
          status: 'error',
          error,
          error_description: errorDescription,
          state,
        });

        res.redirect(redirectUrl);
        return;
      }

      if (code || accessToken) {
        const redirectUrl = buildAppRedirectUrl(APP_AUTH_CALLBACK_URI, {
          provider,
          status: 'success',
          code,
          access_token: accessToken,
          state,
        });

        res.redirect(redirectUrl);
        return;
      }

      const redirectUrl = buildAppRedirectUrl(APP_AUTH_CALLBACK_URI, {
        provider,
        status: 'error',
        error: 'missing_code',
        error_description: 'SNS 인증 서버에서 code 또는 access_token 값을 전달하지 않았습니다.',
      });

      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  };
};


export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const providerParam = String(req.params.provider ?? '').toLowerCase();
    const { accessToken, provider } = validateSocialLoginRequest(req.body);

    if (provider && provider !== providerParam) {
      throw new HttpError(
        400,
        '요청 경로의 provider와 본문 값이 일치하지 않습니다.',
        'PROVIDER_MISMATCH',
      );
    }

    const result = await loginWithSocial(providerParam, accessToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const kakaoCallback = createOAuthCallbackHandler('kakao');
export const naverCallback = createOAuthCallbackHandler('naver');
export const googleCallback = createOAuthCallbackHandler('google');
export const teamsCallback = createOAuthCallbackHandler('teams');
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken: token } = validateRefreshTokenRequest(req.body);

    const result = await refreshAccessToken(token);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, '인증이 필요합니다.', 'UNAUTHORIZED');
    }

    const { refreshToken: token } = validateLogoutRequest(req.body);

    await logoutService(req.user.id, token);

    res.json({ message: '로그아웃 되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export default {
  socialLogin,
  kakaoCallback,
  naverCallback,
  googleCallback,
  teamsCallback,
  refreshToken,
  logout,
};
