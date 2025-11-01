import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

type ExpiresIn = SignOptions['expiresIn'];

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: ExpiresIn;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: ExpiresIn;

}

let cachedConfig: AuthConfig | null = null;

const buildAuthConfig = (): AuthConfig => {
  const {
    JWT_SECRET,
    JWT_EXPIRES_IN = '1h',
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN = '7d',
  } = process.env;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Please set it in the environment.');
  }

  if (!REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured. Please set it in the environment.');
  }

  return {
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: JWT_EXPIRES_IN,
    refreshTokenSecret: REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
  };
};

export const getAuthConfig = (): AuthConfig => {
  if (!cachedConfig) {
    cachedConfig = buildAuthConfig();
  }

  return cachedConfig;
};
