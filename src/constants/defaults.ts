export const GOOGLE_PLACES_DEFAULT_DEBOUNCE = 0 as const;
export const GOOGLE_PLACES_DEFAULT_TIMEOUT = 20000 as const;
export const GOOGLE_PLACES_DEFAULT_MIN_LENGTH = 0 as const;
export const GOOGLE_PLACES_DEFAULT_NUMBER_OF_LINES = 1 as const;
export const GOOGLE_PLACES_DEFAULT_KEYBOARD_PERSIST = 'always' as const;
export const GOOGLE_PLACES_DEFAULT_LIST_VIEW_DISPLAYED = 'auto' as const;
export const GOOGLE_PLACES_DEFAULT_NEARBY_API = 'GooglePlacesSearch' as const;

export const GOOGLE_PLACES_CURRENT_LOCATION_LABEL = 'Current location' as const;

export const GOOGLE_PLACES_GEOLOCATION_OPTIONS = {
  web: {
    enableHighAccuracy: false,
    timeout: 20000,
    maximumAge: 1000,
  },
  android: {
    enableHighAccuracy: true,
    timeout: 20000,
  },
  ios: {
    enableHighAccuracy: false,
    timeout: 20000,
    maximumAge: 1000,
  },
} as const;
