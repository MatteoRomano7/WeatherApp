import { AppError } from '@/lib/domain/errors';

/**
 * Options for HTTP fetch requests
 */
export interface FetchOptions {
  /** Request timeout in milliseconds */
  timeoutMs?: number;
  /** External abort signal */
  signal?: AbortSignal;
}

/**
 * Generic HTTP client wrapper around native fetch with timeout and error handling.
 *
 * @template T - Expected response type
 * @param url - Full URL to fetch
 * @param options - Optional timeout and abort signal
 * @returns Parsed JSON response
 * @throws {AppError} with code 'NETWORK' for network/timeout errors
 * @throws {AppError} with code 'API' for non-2xx responses
 */
export async function fetchJson<T>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? 10000;
  const externalSignal = options?.signal;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  // If external signal is provided, propagate its abort to our controller
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      throw createNetworkError('Request aborted');
    }
    externalSignal.addEventListener('abort', () => abortController.abort());
  }

  try {
    const response = await fetch(url, {
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw createApiError(
        `API request failed with status ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort errors (timeout or external abort)
    if (error instanceof Error && error.name === 'AbortError') {
      throw createNetworkError('Request timeout');
    }

    // Re-throw AppError instances
    if (isAppError(error)) {
      throw error;
    }

    // Network or JSON parse errors
    if (error instanceof Error) {
      throw createNetworkError(error.message);
    }

    // Unknown error type
    throw createNetworkError('Unknown network error');
  }
}

/**
 * Creates a network-related AppError
 */
function createNetworkError(message: string): AppError {
  return {
    code: 'NETWORK',
    message,
  };
}

/**
 * Creates an API-related AppError
 */
function createApiError(message: string, status?: number): AppError {
  return {
    code: 'API',
    message: status ? `${message} (status ${status})` : message,
  };
}

/**
 * Type guard to check if an error is an AppError
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}
