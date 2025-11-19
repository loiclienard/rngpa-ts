import { Platform } from 'react-native';
import type { GooglePlacesApiError, Result } from '../types';
import { GOOGLE_PLACES_GEOLOCATION_OPTIONS } from '../constants/defaults';

export interface GeolocationCoordinates {
  readonly latitude: number;
  readonly longitude: number;
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly speed: number | null;
}

export interface GeolocationPosition {
  readonly coords: GeolocationCoordinates;
  readonly timestamp: number;
}

/**
 * Gets the current geolocation position
 */
export function getCurrentLocation(
  enableHighAccuracy: boolean,
): Promise<Result<GeolocationPosition, GooglePlacesApiError>> {
  return new Promise((resolve) => {
    // Check if geolocation is available
    if (!navigator?.geolocation) {
      resolve({
        success: false,
        error: {
          type: 'network',
          message: 'Geolocation is not supported by this device',
          originalError: new Error('Geolocation not available'),
        },
      });
      return;
    }

    // Determine platform-specific options
    const options = getGeolocationOptions(enableHighAccuracy);

    // Get the getCurrentPosition method (React Native compatibility)
    const geolocationWithDefault =
      navigator.geolocation as typeof navigator.geolocation & {
        default?: typeof navigator.geolocation;
      };
    const getCurrentPosition =
      navigator.geolocation.getCurrentPosition ||
      geolocationWithDefault.default?.getCurrentPosition;

    if (!getCurrentPosition) {
      resolve({
        success: false,
        error: {
          type: 'network',
          message: 'getCurrentPosition method not available',
          originalError: new Error('getCurrentPosition not available'),
        },
      });
      return;
    }

    getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          success: true,
          data: position,
        });
      },
      (error: GeolocationPositionError) => {
        resolve({
          success: false,
          error: {
            type: 'network',
            message: error.message,
            originalError: new Error(error.message),
          },
        });
      },
      options,
    );
  });
}

/**
 * Gets platform-specific geolocation options
 */
function getGeolocationOptions(enableHighAccuracy: boolean): PositionOptions {
  const platform = Platform.OS;

  if (enableHighAccuracy && platform === 'android') {
    return GOOGLE_PLACES_GEOLOCATION_OPTIONS.android;
  }

  if (platform === 'web') {
    return GOOGLE_PLACES_GEOLOCATION_OPTIONS.web;
  }

  return GOOGLE_PLACES_GEOLOCATION_OPTIONS.ios;
}
