export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const unauthorized = () => new ApiError(401, 'UNAUTHORIZED', '인증이 필요합니다');
export const forbidden = () => new ApiError(403, 'FORBIDDEN', '권한이 없습니다');
export const invalidInput = (details?: unknown) => new ApiError(400, 'INVALID_INPUT', '입력값을 확인하세요', details);
export const notFound = (resource: string, id: string) => new ApiError(404, 'NOT_FOUND', `${resource}을(를) 찾을 수 없습니다`, { resource, id });
export const conflict = (message: string) => new ApiError(409, 'CONFLICT', message);
