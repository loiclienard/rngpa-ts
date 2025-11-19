import type {
  GooglePlacesApiError,
  GooglePlacesRequestConfig,
  Result,
} from '../types';
import { GOOGLE_PLACES_API_BASE_URL } from '../constants/api';

/**
 * Makes a fetch request with timeout and abort support
 * Returns a Result type with discriminated union for error handling
 */
export async function makeGooglePlacesRequest<T>(
  config: GooglePlacesRequestConfig,
  signal?: AbortSignal,
): Promise<Result<T, GooglePlacesApiError>> {
  const { url, method, headers, body, timeout } = config;

  try {
    // Create a timeout promise that rejects after the specified time
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeout);
    });

    // Create the fetch promise
    const fetchPromise = fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
      signal,
      credentials: url.includes(GOOGLE_PLACES_API_BASE_URL)
        ? 'same-origin'
        : 'omit',
    });

    // Race between timeout and actual request
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      return {
        success: false,
        error: {
          type: 'api_response',
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: String(response.status),
          responseBody: errorBody,
        },
      };
    }

    const data: T = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    // Handle abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'abort',
          message: 'Request was aborted',
        },
      };
    }

    // Handle timeout errors
    if (error instanceof Error && error.message === 'Request timeout') {
      return {
        success: false,
        error: {
          type: 'timeout',
          message: `Request timed out after ${timeout}ms`,
          timeoutMs: timeout,
        },
      };
    }

    // Handle network errors
    return {
      success: false,
      error: {
        type: 'network',
        message:
          error instanceof Error ? error.message : 'Network request failed',
        originalError:
          error instanceof Error ? error : new Error(String(error)),
      },
    };
  }
}

/**
 * Determines if the URL should use credentials based on the base URL
 */
export function requestShouldUseCredentials(url: string): boolean {
  return url === GOOGLE_PLACES_API_BASE_URL;
}

/**
 * Extracts custom headers from request URL configuration
 */
export function extractRequestHeaders(
  requestUrlHeaders: Readonly<Record<string, string>> | undefined,
): Readonly<Record<string, string>> {
  return requestUrlHeaders ?? {};
}

/**
 * Creates an AbortController for request cancellation
 */
export function createAbortController(): AbortController {
  return new AbortController();
}

/**
 * Aborts all provided AbortControllers
 */
export function abortAllRequests(controllers: AbortController[]): void {
  controllers.forEach((controller) => {
    try {
      controller.abort();
    } catch (error) {
      // Ignore errors when aborting
      console.warn('Error aborting request:', error);
    }
  });
}
