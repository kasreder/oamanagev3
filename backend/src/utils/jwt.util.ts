import jwt, { SignOptions } from 'jsonwebtoken';

import { authConfig, UserRole } from '../config/auth';
import { AuthUser } from '../types/api.types';

export interface AccessTokenPayload extends jwt.JwtPayload {
  id: number;
  employeeId?: string;
  email?: string;
  name?: string;
  role: Exclude<UserRole, 'guest'>;
  provider?: string;
}

const buildSignOptions = (expiresIn: SignOptions['expiresIn']): SignOptions => ({
  expiresIn,
  audience: authConfig.audience,
  issuer: authConfig.issuer,
});

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, authConfig.accessToken.secret as jwt.Secret, buildSignOptions(authConfig.accessToken.expiresIn));
};

export const signRefreshToken = (payload: Pick<AccessTokenPayload, 'id'>): string => {
  return jwt.sign(payload, authConfig.refreshToken.secret as jwt.Secret, buildSignOptions(authConfig.refreshToken.expiresIn));
};

export const verifyAccessToken = (token: string): AuthUser => {
  const decoded = jwt.verify(token, authConfig.accessToken.secret as jwt.Secret, {
    audience: authConfig.audience,
    issuer: authConfig.issuer,
  });

  const payload = decoded as AccessTokenPayload;
  return {
    id: payload.id,
    employeeId: payload.employeeId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    provider: payload.provider,
  };
};

export const verifyRefreshToken = (token: string): Pick<AccessTokenPayload, 'id'> => {
  const decoded = jwt.verify(token, authConfig.refreshToken.secret as jwt.Secret, {
    audience: authConfig.audience,
    issuer: authConfig.issuer,
  });

  const payload = decoded as AccessTokenPayload;
  return { id: payload.id };
};

export const decodeToken = <T extends jwt.JwtPayload = jwt.JwtPayload>(token: string): T | null => {
  try {
    return jwt.decode(token) as T | null;
  } catch (error) {
    return null;
  }
};
