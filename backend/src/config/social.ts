import dotenv from 'dotenv';

dotenv.config();

export interface SocialProviderConfig {
  tokenInfoUrl: string;
  userInfoUrl: string;
  clientId?: string;
  clientSecret?: string;
  additionalParams?: Record<string, string>;
}

export interface SocialConfig {
  kakao: SocialProviderConfig;
  naver: SocialProviderConfig;
  google: SocialProviderConfig;
  teams: SocialProviderConfig;
}

export const socialConfig: SocialConfig = {
  kakao: {
    tokenInfoUrl: 'https://kapi.kakao.com/v1/user/access_token_info',
    userInfoUrl: 'https://kapi.kakao.com/v2/user/me',
    clientId: process.env.KAKAO_REST_API_KEY,
  },
  naver: {
    tokenInfoUrl: 'https://openapi.naver.com/v1/nid/me',
    userInfoUrl: 'https://openapi.naver.com/v1/nid/me',
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  },
  google: {
    tokenInfoUrl: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  teams: {
    tokenInfoUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    clientId: process.env.TEAMS_CLIENT_ID,
    clientSecret: process.env.TEAMS_CLIENT_SECRET,
    additionalParams: {
      tenant: process.env.TEAMS_TENANT_ID ?? 'common',
    },
  },
};
