import axios, { AxiosError } from 'axios';
import { createHash } from 'crypto';

import { authConfig } from '../config/auth';
import { socialConfig } from '../config/social';
import { HttpError } from '../middlewares/error.middleware';
import {
  SocialProfile,
  SocialProvider,
  User,
} from '../models/User';
import * as userRepository from '../repositories/user.repository';
import { decodeToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import logger from '../utils/logger';

interface SocialLoginResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: Pick<User, 'id' | 'name' | 'email' | 'provider' | 'role' | 'employeeId'>;
}

interface RefreshTokenResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const SUPPORTED_PROVIDERS: SocialProvider[] = ['kakao', 'naver', 'google', 'teams'];

const ensureProvider = (provider: string): SocialProvider => {
  if ((SUPPORTED_PROVIDERS as string[]).includes(provider)) {
    return provider as SocialProvider;
  }

  throw new HttpError(400, '지원하지 않는 소셜 로그인입니다.', 'UNSUPPORTED_PROVIDER');
};

const buildEmployeeId = (provider: SocialProvider, providerId: string): string => {
  const hash = createHash('sha256').update(providerId).digest('hex').slice(0, 12);
  return `${provider.toUpperCase()}-${hash}`.slice(0, 32);
};

const parseKakaoProfile = (data: any): SocialProfile => ({
  id: String(data.id ?? data?.kakao_account?.id ?? ''),
  email: data?.kakao_account?.email ?? undefined,
  name: data?.kakao_account?.profile?.nickname ?? data?.properties?.nickname ?? undefined,
});

const parseNaverProfile = (data: any): SocialProfile => ({
  id: String(data?.response?.id ?? ''),
  email: data?.response?.email ?? undefined,
  name: data?.response?.name ?? data?.response?.nickname ?? undefined,
});

const parseGoogleProfile = (data: any): SocialProfile => ({
  id: String(data?.sub ?? data?.id ?? ''),
  email: data?.email ?? data?.user?.email ?? undefined,
  name: data?.name ?? data?.user?.name ?? undefined,
});

const parseTeamsProfile = (data: any): SocialProfile => ({
  id: String(data?.id ?? data?.user?.id ?? ''),
  email: data?.mail ?? data?.userPrincipalName ?? undefined,
  name: data?.displayName ?? data?.user?.displayName ?? undefined,
});

const parseProfileByProvider = (provider: SocialProvider, data: any): SocialProfile => {
  switch (provider) {
    case 'kakao':
      return parseKakaoProfile(data);
    case 'naver':
      return parseNaverProfile(data);
    case 'google':
      return parseGoogleProfile(data);
    case 'teams':
      return parseTeamsProfile(data);
    default:
      return { id: '' };
  }
};

const fetchSocialProfile = async (
  provider: SocialProvider,
  accessToken: string,
): Promise<SocialProfile> => {
  const config = socialConfig[provider];
  if (!config) {
    throw new HttpError(400, '소셜 로그인 구성이 올바르지 않습니다.', 'INVALID_SOCIAL_CONFIG');
  }

  try {
    const response = await axios.get(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      params: config.additionalParams,
    });

    const profile = parseProfileByProvider(provider, response.data);

    if (!profile.id) {
      throw new HttpError(401, '소셜 프로필 정보를 확인할 수 없습니다.', 'INVALID_SOCIAL_PROFILE');
    }

    return profile;
  } catch (error) {
    const axiosError = error as AxiosError;
    logger.warn('Social login failed', {
      provider,
      error: axiosError.response?.data ?? axiosError.message,
    });

    throw new HttpError(
      401,
      '소셜 토큰이 유효하지 않습니다.',
      'INVALID_SOCIAL_TOKEN',
      axiosError.response?.data ?? axiosError.message,
    );
  }
};

const sanitizeUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  provider: user.provider,
  role: user.role,
  employeeId: user.employeeId,
});

const calculateExpiresInSeconds = (token: string): number => {
  const decoded = decodeToken<{ exp?: number }>(token);
  if (!decoded?.exp) {
    return 0;
  }

  const expiresInMs = decoded.exp * 1000 - Date.now();
  return Math.max(Math.floor(expiresInMs / 1000), 0);
};

const extractRefreshExpiry = (token: string): Date => {
  const decoded = decodeToken<{ exp?: number }>(token);
  if (!decoded?.exp) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  return new Date(decoded.exp * 1000);
};

const upsertSocialUser = async (
  provider: SocialProvider,
  profile: SocialProfile,
): Promise<User> => {
  const existingUser = await userRepository.findByProvider(provider, profile.id);

  if (existingUser) {
    const updated = await userRepository.updateUser(existingUser.id, {
      email: typeof profile.email === 'string' ? profile.email : existingUser.email,
      name: typeof profile.name === 'string' ? profile.name : existingUser.name,
      isActive: true,
    });

    return updated ?? existingUser;
  }

  const employeeId = buildEmployeeId(provider, profile.id);

  return userRepository.createUser({
    employeeId,
    name: profile.name ?? `${provider.toUpperCase()} 사용자`,
    email: profile.email ?? null,
    provider,
    providerId: profile.id,
    isActive: true,
  });
};

export const loginWithSocial = async (
  providerParam: string,
  accessToken: string,
): Promise<SocialLoginResult> => {
  const provider = ensureProvider(providerParam.toLowerCase());

  const profile = await fetchSocialProfile(provider, accessToken);

  const user = await upsertSocialUser(provider, profile);

  await userRepository.updateLastLogin(user.id);

  await userRepository.deleteRefreshTokensByUserId(user.id);

  const jwtAccessToken = signAccessToken({
    id: user.id,
    employeeId: user.employeeId,
    email: user.email ?? undefined,
    name: user.name,
    role: user.role,
    provider: user.provider ?? undefined,
  });

  const jwtRefreshToken = signRefreshToken({ id: user.id });
  const refreshExpiresAt = extractRefreshExpiry(jwtRefreshToken);

  await userRepository.saveRefreshToken(user.id, jwtRefreshToken, refreshExpiresAt);

  return {
    access_token: jwtAccessToken,
    refresh_token: jwtRefreshToken,
    expires_in: calculateExpiresInSeconds(jwtAccessToken),
    user: sanitizeUser(user),
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResult> => {
  const payload = verifyRefreshToken(refreshToken);

  const savedToken = await userRepository.findRefreshToken(refreshToken);

  if (!savedToken) {
    throw new HttpError(401, '만료되었거나 존재하지 않는 토큰입니다.', 'REFRESH_TOKEN_NOT_FOUND');
  }

  if (savedToken.expiresAt.getTime() <= Date.now()) {
    await userRepository.deleteRefreshToken(refreshToken);
    throw new HttpError(401, 'Refresh 토큰이 만료되었습니다.', 'REFRESH_TOKEN_EXPIRED');
  }

  const user = await userRepository.findById(payload.id);

  if (!user) {
    await userRepository.deleteRefreshToken(refreshToken);
    throw new HttpError(404, '사용자를 찾을 수 없습니다.', 'USER_NOT_FOUND');
  }

  const newAccessToken = signAccessToken({
    id: user.id,
    employeeId: user.employeeId,
    email: user.email ?? undefined,
    name: user.name,
    role: user.role,
    provider: user.provider ?? undefined,
  });

  const newRefreshToken = signRefreshToken({ id: user.id });
  const expiresAt = extractRefreshExpiry(newRefreshToken);

  await userRepository.deleteRefreshToken(refreshToken);
  await userRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    expires_in: calculateExpiresInSeconds(newAccessToken),
  };
};

export const logout = async (userId: number, refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    await userRepository.deleteRefreshToken(refreshToken);
    return;
  }

  await userRepository.deleteRefreshTokensByUserId(userId);
};

export const getAuthConfig = () => ({
  issuer: authConfig.issuer,
  audience: authConfig.audience,
  accessTokenExpiresIn: authConfig.accessToken.expiresIn,
  refreshTokenExpiresIn: authConfig.refreshToken.expiresIn,
});
