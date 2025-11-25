import { afterEach, describe, expect, it, jest } from '@jest/globals';

describe('buildTokenRequestParams', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('카카오 토큰 요청에 등록된 redirect_uri를 그대로 사용한다', async () => {
    process.env = {
      ...originalEnv,
      KAKAO_REST_API_KEY: 'client-id',
      KAKAO_CLIENT_SECRET: 'client-secret',
      KAKAO_REDIRECT_URI: 'https://example.com/auth/kakao/callback',
    };

    jest.resetModules();
    const { buildTokenRequestParams } = await import('../../src/services/auth.service');

    const { params, redirectUri, tokenUrl } = buildTokenRequestParams('kakao', 'auth-code');

    expect(tokenUrl).toBe('https://kauth.kakao.com/oauth/token');
    expect(redirectUri).toBe('https://example.com/auth/kakao/callback');
    expect(params.get('redirect_uri')).toBe('https://example.com/auth/kakao/callback');
    expect(params.get('client_id')).toBe('client-id');
    expect(params.get('client_secret')).toBe('client-secret');
  });
});
