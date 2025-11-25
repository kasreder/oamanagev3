import dotenv from 'dotenv';

dotenv.config();

export interface SocialProviderConfig {
  tokenUrl: string;
  tokenInfoUrl: string;
  userInfoUrl: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  redirect_uri?: string;
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
    tokenUrl: 'https://kauth.kakao.com/oauth/token',
    tokenInfoUrl: 'https://kapi.kakao.com/v1/user/access_token_info',
    userInfoUrl: 'https://kapi.kakao.com/v2/user/me',
    clientId: process.env.KAKAO_REST_API_KEY, // 키입력 필수
<<<<<<< HEAD
    redirectUri: process.env.KAKAO_REDIRECT_URI,
=======
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
>>>>>>> d8b134ea02c31f4cb7bd7f534b69d0a03c48df5a
  },
  naver: {
    tokenUrl: 'https://nid.naver.com/oauth2.0/token',
    tokenInfoUrl: 'https://openapi.naver.com/v1/nid/me',
    userInfoUrl: 'https://openapi.naver.com/v1/nid/me',
    clientId: process.env.NAVER_CLIENT_ID, // 키입력 필수
    clientSecret: process.env.NAVER_CLIENT_SECRET, // 키입력 필수
    redirectUri: process.env.NAVER_REDIRECT_URI,
  },
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    tokenInfoUrl: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    clientId: process.env.GOOGLE_CLIENT_ID, // 키입력 필수
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 키입력 필수
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  teams: {
    tokenUrl: `https://login.microsoftonline.com/${process.env.TEAMS_TENANT_ID ?? 'common'}/oauth2/v2.0/token`,
    tokenInfoUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    clientId: process.env.TEAMS_CLIENT_ID, // 키입력 필수
    clientSecret: process.env.TEAMS_CLIENT_SECRET, // 키입력 필수
    additionalParams: {
      tenant: process.env.TEAMS_TENANT_ID ?? 'common',
    },
    redirectUri: process.env.TEAMS_REDIRECT_URI,
  },
};
