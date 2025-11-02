import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

const ensureValue = (value: string | undefined, fallback?: string): string => {
  if (value && value.length > 0) {
    return value;
  }

  if (fallback) {
    return fallback;
  }

  return '';
};

interface TokenConfig {
  secret: string;
  expiresIn: SignOptions['expiresIn'];
}

interface AuthConfig {
  issuer: string;
  audience: string;
  accessToken: TokenConfig;
  refreshToken: TokenConfig;
}

export const authConfig: AuthConfig = {
  issuer: process.env.JWT_ISSUER ?? 'oa-asset-manager',
  audience: process.env.JWT_AUDIENCE ?? 'oa-asset-manager-clients',
  accessToken: {
    secret: ensureValue(process.env.JWT_SECRET), // 키입력 필수
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
  },
  refreshToken: {
    secret: ensureValue(process.env.REFRESH_TOKEN_SECRET, process.env.JWT_SECRET), // 키입력 필수
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
  },
};

if (!authConfig.accessToken.secret) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  JWT_SECRET 환경 변수가 설정되지 않았습니다. 토큰 검증이 실패할 수 있습니다.');
}

export type UserRole = 'guest' | 'user' | 'admin';
