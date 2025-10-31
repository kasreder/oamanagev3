import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { users } from '@/data/mock-data';
import type { User } from '@/types/domain';
import { invalidInput, unauthorized } from '@/utils/errors';

const supportedProviders = ['kakao', 'naver', 'google', 'teams'] as const;

type SupportedProvider = (typeof supportedProviders)[number];

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

const createJwt = (user: User): string => {
  const secret = process.env.JWT_SECRET || 'development-secret';
  const expiresIn = Number(process.env.JWT_EXPIRES_IN) || 3600;
  return jwt.sign({ sub: user.id, provider: user.provider, name: user.name }, secret, {
    expiresIn
  });
};

export class AuthService {
  socialLogin(provider: string, accessToken: string): AuthTokens {
    if (!supportedProviders.includes(provider as SupportedProvider)) {
      throw invalidInput({ provider, reason: '지원하지 않는 소셜 로그인입니다.' });
    }

    if (!accessToken) {
      throw invalidInput({ reason: 'accessToken이 필요합니다.' });
    }

    const user = users.find((candidate) => candidate.provider === provider);
    if (!user) {
      throw unauthorized();
    }

    return {
      access_token: createJwt(user),
      refresh_token: uuid(),
      expires_in: Number(process.env.JWT_EXPIRES_IN) || 3600,
      user
    };
  }

  issueWithCredentials(email: string, password: string): AuthTokens {
    if (!email || !password) {
      throw invalidInput({ reason: '이메일과 비밀번호를 입력하세요.' });
    }

    const user = users.find((candidate) => candidate.email === email);
    if (!user) {
      throw unauthorized();
    }

    return {
      access_token: createJwt(user),
      refresh_token: uuid(),
      expires_in: Number(process.env.JWT_EXPIRES_IN) || 3600,
      user
    };
  }

  refreshToken(): { access_token: string; expires_in: number } {
    const user = users[0];
    return {
      access_token: createJwt(user),
      expires_in: Number(process.env.JWT_EXPIRES_IN) || 3600
    };
  }
}

export const authService = new AuthService();
