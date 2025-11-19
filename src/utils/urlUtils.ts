import { Platform } from 'react-native';
import type { GooglePlacesRequestUrl } from '../types';
import { GOOGLE_PLACES_API_BASE_URL } from '../constants/api';

/**
 * Determines the API URL based on platform and configuration
 */
export function determineApiUrl(
  requestUrl: GooglePlacesRequestUrl | undefined,
): string {
  if (!requestUrl) {
    return GOOGLE_PLACES_API_BASE_URL;
  }

  if (requestUrl.useOnPlatform === 'all') {
    return requestUrl.url;
  }

  if (requestUrl.useOnPlatform === 'web') {
    return Platform.select({
      web: requestUrl.url,
      default: GOOGLE_PLACES_API_BASE_URL,
    });
  }

  return GOOGLE_PLACES_API_BASE_URL;
}

/**
 * Extracts custom headers from requestUrl configuration
 */
export function extractCustomHeaders(
  requestUrl: GooglePlacesRequestUrl | undefined,
): Readonly<Record<string, string>> {
  return requestUrl?.headers ?? {};
}
