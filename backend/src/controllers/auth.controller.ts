import type { Request, Response } from 'express';

import { authService } from '@/services/auth.service';

export const socialLogin = (req: Request, res: Response): void => {
  const { provider } = req.params;
  const { accessToken } = req.body;
  const tokens = authService.socialLogin(provider, accessToken);
  res.json(tokens);
};

export const credentialLogin = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const tokens = authService.issueWithCredentials(email, password);
  res.json(tokens);
};

export const refreshToken = (_req: Request, res: Response): void => {
  res.json(authService.refreshToken());
};

export const logout = (_req: Request, res: Response): void => {
  res.json({ message: '로그아웃 성공' });
};
