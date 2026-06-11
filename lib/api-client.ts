/**
 * API Client Utility
 * Centralized API communication with error handling and request/response formatting
 */

interface ApiResponse<T> {
  status?: 'success' | 'error';
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

interface ApiError extends Error {
  statusCode?: number;
  data?: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL.replace(/\/$/, '')}/api`;

const normalizeApiPath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath.startsWith('/api/')
    ? normalizedPath.replace(/^\/api/, '')
    : normalizedPath;
};

export class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Core request method
   */
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${normalizeApiPath(path)}`;

    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions: RequestInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      const responseData = await this.parseResponse<T>(response);

      if (!response.ok) {
        throw this.createError(
          responseData.message || 'API request failed',
          response.status,
          responseData
        );
      }

      if (Object.prototype.hasOwnProperty.call(responseData, 'data')) {
        return responseData.data as T;
      }

      return responseData as T;
    } catch (error) {
      if (ApiClient.isApiError(error)) {
        throw error;
      }

      if (error instanceof SyntaxError) {
        throw this.createError('Invalid response from server', 500);
      }

      throw this.createError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  /**
   * Parse response
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: response.ok,
        statusCode: response.status,
        data: (await response.text()) as any,
      };
    }

    return response.json();
  }

  /**
   * Create API error
   */
  private createError(message: string, statusCode: number, data?: any): ApiError {
    const error = new Error(message) as ApiError;
    error.statusCode = statusCode;
    error.data = data;
    return error;
  }

  /**
   * Check if error is API error
   */
  static isApiError(error: any): error is ApiError {
    return error instanceof Error && 'statusCode' in error;
  }

  /**
   * Get error message
   */
  static getErrorMessage(error: unknown): string {
    if (ApiClient.isApiError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }

  /**
   * Get HTTP status code from error
   */
  static getErrorStatusCode(error: unknown): number | undefined {
    if (ApiClient.isApiError(error)) {
      return error.statusCode;
    }
    return undefined;
  }
}

/**
 * Singleton instance
 */
export const apiClient = ApiClient.getInstance();

/**
 * Convenience methods
 */
export const api = {
  get: <T,>(path: string, options?: RequestInit) =>
    apiClient.get<T>(path, options),
  post: <T,>(path: string, body?: any, options?: RequestInit) =>
    apiClient.post<T>(path, body, options),
  put: <T,>(path: string, body?: any, options?: RequestInit) =>
    apiClient.put<T>(path, body, options),
  patch: <T,>(path: string, body?: any, options?: RequestInit) =>
    apiClient.patch<T>(path, body, options),
  delete: <T,>(path: string, options?: RequestInit) =>
    apiClient.delete<T>(path, options),
};

/**
 * API Error utility class
 */
export class ApiErrorHandler {
  static handle(error: unknown): { message: string; statusCode?: number } {
    const message = ApiClient.getErrorMessage(error);
    const statusCode = ApiClient.getErrorStatusCode(error);

    return { message, statusCode };
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message.includes('fetch');
  }

  static isValidationError(error: unknown): boolean {
    const statusCode = ApiClient.getErrorStatusCode(error);
    return statusCode === 400;
  }

  static isAuthError(error: unknown): boolean {
    const statusCode = ApiClient.getErrorStatusCode(error);
    return statusCode === 401;
  }

  static isForbiddenError(error: unknown): boolean {
    const statusCode = ApiClient.getErrorStatusCode(error);
    return statusCode === 403;
  }

  static isNotFoundError(error: unknown): boolean {
    const statusCode = ApiClient.getErrorStatusCode(error);
    return statusCode === 404;
  }
}
