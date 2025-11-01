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

  const signOptions: SignOptions = {
    ...options,
    expiresIn: options.expiresIn ?? jwtExpiresIn,
  };

  return jwt.sign(payload, jwtSecret, signOptions);

};

export const signRefreshToken = (
  payload: AuthenticatedUser,
  options: SignOptions = {}
): string => {
  const { refreshTokenSecret, refreshTokenExpiresIn } = getAuthConfig();

  const signOptions: SignOptions = {
    ...options,
    expiresIn: options.expiresIn ?? refreshTokenExpiresIn,
  };

  return jwt.sign(payload, refreshTokenSecret, signOptions);

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
