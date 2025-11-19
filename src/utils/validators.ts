import { Platform } from 'react-native';

/**
 * Type predicate to check if the platform is web
 */
export function isPlatformWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Type predicate to check if geolocation is supported
 */
export function hasGeolocationSupport(): boolean {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return true;
  }

  if (!hasGeolocationSupport()) {
    console.warn(
      'If you are using React Native v0.60.0+ you must follow these instructions to enable currentLocation: https://git.io/Jf4AR',
    );
  }

  return false;
}

/**
 * Checks if the platform is supported for Google Places API
 * Web platform requires a custom requestUrl
 */
export function isPlatformSupported(hasCustomRequestUrl: boolean): boolean {
  if (isPlatformWeb() && !hasCustomRequestUrl) {
    console.warn(
      'This library cannot be used for the web unless you specify the requestUrl prop. See https://git.io/JflFv for more details.',
    );
    return false;
  }

  return true;
}
