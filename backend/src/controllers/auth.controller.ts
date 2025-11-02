import { NextFunction, Request, Response } from 'express';

import {
  isSupportedProvider,
  loginWithSocial,
  logout as logoutService,
  refreshAccessToken,
} from '../services/auth.service';
import {
  validateLogoutRequest,
  validateRefreshTokenRequest,
  validateSocialLoginRequest,
} from '../validators/auth.validator';
import { HttpError } from '../middlewares/error.middleware';
import logger from '../utils/logger';

const getSingleQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === 'string' ? value : undefined;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildValueRow = (label: string, value: string): string => `
  <div class="value-row">
    <span class="label">${escapeHtml(label)}</span>
    <code>${escapeHtml(value)}</code>
  </div>
`;

type CallbackStatus = 'success' | 'error' | 'info';

interface CallbackPageOptions {
  title: string;
  description: string;
  status: CallbackStatus;
  body?: string;
}

const buildCallbackPage = ({
  title,
  description,
  status,
  body,
}: CallbackPageOptions): string => `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        font-family: 'Pretendard', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background: #f5f6f8;
        color: #111827;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background: #0f172a;
          color: #f8fafc;
        }
      }
      main.container {
        max-width: 480px;
        margin: 64px auto;
        padding: 32px 28px;
        border-radius: 16px;
        box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.95);
      }
      @media (prefers-color-scheme: dark) {
        main.container {
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
        }
      }
      main.container.status-success {
        border-top: 6px solid #16a34a;
      }
      main.container.status-error {
        border-top: 6px solid #dc2626;
      }
      main.container.status-info {
        border-top: 6px solid #0ea5e9;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 12px;
        font-size: 1.5rem;
      }
      p.description {
        margin-top: 0;
        margin-bottom: 24px;
        line-height: 1.6;
        color: rgba(17, 24, 39, 0.78);
      }
      @media (prefers-color-scheme: dark) {
        p.description {
          color: rgba(248, 250, 252, 0.78);
        }
      }
      section.panel {
        padding: 20px;
        border-radius: 12px;
        background: rgba(241, 245, 249, 0.85);
      }
      @media (prefers-color-scheme: dark) {
        section.panel {
          background: rgba(30, 41, 59, 0.7);
        }
      }
      .value-row {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
      }
      .value-row:last-of-type {
        margin-bottom: 0;
      }
      .label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 9999px;
        background: rgba(59, 130, 246, 0.15);
        color: #1d4ed8;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        width: fit-content;
      }
      code {
        display: block;
        padding: 12px 14px;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.08);
        font-family: 'Roboto Mono', 'Menlo', Consolas, monospace;
        word-break: break-all;
        font-size: 0.9rem;
      }
      @media (prefers-color-scheme: dark) {
        code {
          background: rgba(15, 23, 42, 0.5);
        }
      }
      p.note {
        margin-top: 16px;
        margin-bottom: 0;
        font-size: 0.9rem;
        color: rgba(17, 24, 39, 0.7);
      }
      @media (prefers-color-scheme: dark) {
        p.note {
          color: rgba(248, 250, 252, 0.7);
        }
      }
      p.footer {
        margin-top: 28px;
        margin-bottom: 0;
        font-size: 0.85rem;
        color: rgba(17, 24, 39, 0.56);
        text-align: center;
      }
      @media (prefers-color-scheme: dark) {
        p.footer {
          color: rgba(248, 250, 252, 0.56);
        }
      }
    </style>
  </head>
  <body>
    <main class="container status-${status}">
      <h1>${escapeHtml(title)}</h1>
      <p class="description">${escapeHtml(description)}</p>
      ${body ?? ''}
      <p class="footer">이 창은 닫아도 안전합니다.</p>
    </main>
  </body>
</html>`;

export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const providerParam = String(req.params.provider ?? '').toLowerCase();
    const { accessToken, provider } = validateSocialLoginRequest(req.body);

    if (provider && provider !== providerParam) {
      throw new HttpError(
        400,
        '요청 경로의 provider와 본문 값이 일치하지 않습니다.',
        'PROVIDER_MISMATCH',
      );
    }

    const result = await loginWithSocial(providerParam, accessToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const handleOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const provider = String(req.params.provider ?? '').toLowerCase();

    if (!isSupportedProvider(provider)) {
      throw new HttpError(400, '지원하지 않는 소셜 로그인입니다.', 'UNSUPPORTED_PROVIDER');
    }

    const code = getSingleQueryValue(req.query.code);
    const state = getSingleQueryValue(req.query.state);
    const error = getSingleQueryValue(req.query.error);
    const errorDescription =
      getSingleQueryValue(req.query.error_description) ??
      getSingleQueryValue((req.query as Record<string, unknown>)['errorDescription']);
    const accessToken =
      getSingleQueryValue(req.query.access_token) ??
      getSingleQueryValue((req.query as Record<string, unknown>)['accessToken']);

    logger.info('OAuth callback received', {
      provider,
      hasCode: Boolean(code),
      hasAccessToken: Boolean(accessToken),
      error,
      state,
    });

    let statusCode = 200;
    let bodyHtml = '';
    let title = '';
    let description = '';
    let status: CallbackStatus = 'success';

    if (error) {
      statusCode = 400;
      status = 'error';
      title = '소셜 로그인에 실패했습니다.';
      description = '다음 오류 정보를 확인한 뒤 다시 시도해주세요.';
      const errorDescriptionNote = errorDescription
        ? `<p class="note">${escapeHtml(errorDescription)}</p>`
        : '';
      bodyHtml = `
        <section class="panel">
          ${buildValueRow('provider', provider)}
          ${buildValueRow('error', error)}
          ${errorDescriptionNote}
          ${state ? buildValueRow('state', state) : ''}
        </section>
      `;
    } else if (code || accessToken) {
      status = 'success';
      title = '소셜 로그인 인증 정보가 도착했습니다.';
      description = '아래 값을 복사해 앱으로 돌아가면 로그인이 이어집니다.';
      const rows = [
        buildValueRow('provider', provider),
        code ? buildValueRow('code', code) : '',
        accessToken ? buildValueRow('access_token', accessToken) : '',
        state ? buildValueRow('state', state) : '',
      ]
        .filter(Boolean)
        .join('\n');

      bodyHtml = `
        <section class="panel">
          ${rows}
          <p class="note">위 정보를 Flutter 앱으로 전달하면 로그인을 완료할 수 있습니다.</p>
        </section>
      `;
    } else {
      statusCode = 400;
      status = 'info';
      title = '인증 코드를 찾을 수 없습니다.';
      description = 'SNS 인증 서버에서 전달된 code 혹은 access_token 값을 함께 보내주세요.';
      bodyHtml = `
        <section class="panel">
          ${buildValueRow('provider', provider)}
          <p class="note">요청에 code 또는 access_token 파라미터가 포함되어 있지 않습니다.</p>
        </section>
      `;
    }

    const pageHtml = buildCallbackPage({
      title,
      description,
      status,
      body: bodyHtml,
    });

    res.status(statusCode).type('html').send(pageHtml);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken: token } = validateRefreshTokenRequest(req.body);

    const result = await refreshAccessToken(token);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, '인증이 필요합니다.', 'UNAUTHORIZED');
    }

    const { refreshToken: token } = validateLogoutRequest(req.body);

    await logoutService(req.user.id, token);

    res.json({ message: '로그아웃 되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export default {
  socialLogin,
  handleOAuthCallback,
  refreshToken,
  logout,
};
