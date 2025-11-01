import { NextFunction, Request, Response } from 'express';

import { authService } from '@/services/auth.service';
import { userRepository } from '@/repositories/user.repository';
import { ApiResponse } from '@/types/api.types';
import { parseRefreshPayload, parseSocialLoginPayload } from '@/validators/auth.validator';

export class AuthController {
  async socialLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, providerId } = parseSocialLoginPayload({
        ...req.body,
        provider: req.params.provider ?? req.body?.provider,
      });

      const user = await userRepository.findByProvider(provider, providerId);

      if (!user) {
        res.status(404).json({ error: 'USER_NOT_FOUND', message: '등록되지 않은 사용자입니다.' });
        return;
      }

      const { tokens } = await authService.issueSocialLogin(user);

      const response: ApiResponse<{ accessToken: string; refreshToken: string; user: typeof user }> = {
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = parseRefreshPayload(req.body);

      const tokens = await authService.refresh(refreshToken);

      const response: ApiResponse<{ accessToken: string; refreshToken: string }> = {
        data: tokens,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = parseRefreshPayload(req.body);
      await authService.logout(refreshToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
