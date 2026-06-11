import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiErrorHandler, apiClient } from '@/lib/api-client';

describe('apiClient error handling', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes JSON API errors with status codes', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'error',
          statusCode: 401,
          message: 'No token provided',
        }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }
      )
    );

    await expect(apiClient.get('/auth/profile')).rejects.toMatchObject({
      message: 'No token provided',
      statusCode: 401,
    });
  });

  it('classifies authorization errors', () => {
    const error = Object.assign(new Error('No token provided'), { statusCode: 401 });

    expect(ApiErrorHandler.isAuthError(error)).toBe(true);
    expect(ApiErrorHandler.handle(error)).toEqual({
      message: 'No token provided',
      statusCode: 401,
    });
  });
});
