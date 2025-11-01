import dotenv from 'dotenv';

dotenv.config();

export interface SocialProviderConfig {
  kakao: {
    restApiKey?: string;
  };
  naver: {
    clientId?: string;
    clientSecret?: string;
  };
  google: {
    clientId?: string;
    clientSecret?: string;
  };
  teams: {
    clientId?: string;
    clientSecret?: string;
    tenantId?: string;
  };
}

let cachedConfig: SocialProviderConfig | null = null;

const buildSocialConfig = (): SocialProviderConfig => ({
  kakao: {
    restApiKey: process.env.KAKAO_REST_API_KEY,
  },
  naver: {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  teams: {
    clientId: process.env.TEAMS_CLIENT_ID,
    clientSecret: process.env.TEAMS_CLIENT_SECRET,
    tenantId: process.env.TEAMS_TENANT_ID,
  },
});

export const getSocialConfig = (): SocialProviderConfig => {
  if (!cachedConfig) {
    cachedConfig = buildSocialConfig();
  }

  return cachedConfig;
};
