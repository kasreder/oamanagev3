import jwt, { SignOptions } from 'jsonwebtoken';

import { getAuthConfig } from '@/config/auth';
import { AuthenticatedUser } from '@/types/api.types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const signAccessToken = (
  payload: AuthenticatedUser,
  options: SignOptions = {}
): string => {
  const { jwtSecret, jwtExpiresIn } = getAuthConfig();

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
    ...options,
  });
};

export const signRefreshToken = (
  payload: AuthenticatedUser,
  options: SignOptions = {}
): string => {
  const { refreshTokenSecret, refreshTokenExpiresIn } = getAuthConfig();

  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
    ...options,
  });
};

export const verifyAccessToken = (token: string): AuthenticatedUser => {
  const { jwtSecret } = getAuthConfig();
  return jwt.verify(token, jwtSecret) as AuthenticatedUser;
};

export const verifyRefreshToken = (token: string): AuthenticatedUser => {
  const { refreshTokenSecret } = getAuthConfig();
  return jwt.verify(token, refreshTokenSecret) as AuthenticatedUser;
};

export const issueTokenPair = (user: AuthenticatedUser): TokenPair => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user),
});
