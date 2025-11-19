export const GOOGLE_PLACES_API_BASE_URL =
  'https://maps.googleapis.com/maps/api' as const;

export const GOOGLE_PLACES_ENDPOINTS = {
  autocomplete: {
    legacy: '/place/autocomplete/json',
    new: '/v1/places:autocomplete',
  },
  details: {
    legacy: '/place/details/json',
    new: '/v1/places',
  },
  nearby: '/place/nearbysearch/json',
  geocoding: '/geocode/json',
} as const;

export const GOOGLE_PLACES_DEFAULT_QUERY_PARAMS = {
  language: 'en',
} as const;
