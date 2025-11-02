import { NextFunction, Request, Response } from 'express';

import {
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

export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { accessToken } = validateSocialLoginRequest(req.body);
    const { provider } = req.params;

    const result = await loginWithSocial(provider, accessToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

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
  refreshToken,
  logout,
};
