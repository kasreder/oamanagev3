import { getAuthConfig } from '@/config/auth';
import { userRepository } from '@/repositories/user.repository';
import { refreshTokenRepository } from '@/repositories/refresh-token.repository';
import { issueTokenPair, verifyRefreshToken } from '@/utils/jwt.util';
import { addDurationToNow, parseDuration } from '@/utils/date.util';
import { AuthenticatedUser } from '@/types/api.types';
import { User } from '@/models/User';
import { HttpError } from '@/middlewares/error.middleware';

const toAuthenticatedUser = (user: User): AuthenticatedUser => ({
  id: user.id,
  employeeId: user.employeeId,
  email: user.email ?? undefined,
  name: user.name,
  role: user.role,
});

export class AuthService {
  async issueSocialLogin(user: User): Promise<{ tokens: ReturnType<typeof issueTokenPair>; user: User }>
  {
    const payload = toAuthenticatedUser(user);
    const tokens = issueTokenPair(payload);

    const { refreshTokenExpiresIn } = getAuthConfig();
    const expiresInMs = parseDuration(String(refreshTokenExpiresIn));


    await refreshTokenRepository.create({
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: addDurationToNow(expiresInMs),
    });

    await userRepository.updateLastLogin(user.id);

    return { tokens, user };
  }

  async refresh(refreshToken: string): Promise<ReturnType<typeof issueTokenPair>> {
    const stored = await refreshTokenRepository.findByToken(refreshToken);

    if (!stored) {
      throw new HttpError(401, '리프레시 토큰이 존재하지 않습니다.');
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new HttpError(404, '사용자를 찾을 수 없습니다.');
    }

    await refreshTokenRepository.deleteByToken(refreshToken);

    return (await this.issueSocialLogin(user)).tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await refreshTokenRepository.deleteByToken(refreshToken);
  }
}

export const authService = new AuthService();
