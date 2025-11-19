import Qs from 'qs';
import type {
  GooglePlacesQuery,
  GooglePlacesRequestConfig,
  GooglePlacesSearchType,
  GooglePlacesPlaceType,
  GooglePlacesLanguage,
} from '../types';
import { GOOGLE_PLACES_ENDPOINTS } from '../constants/api';

/**
 * Builds autocomplete request configuration for legacy API
 */
export function buildAutocompleteLegacyRequest(
  baseUrl: string,
  text: string,
  query: GooglePlacesQuery | Record<string, unknown>,
  headers: Readonly<Record<string, string>>,
  timeout: number,
): GooglePlacesRequestConfig {
  const queryString = Qs.stringify({
    input: text,
    ...query,
  });

  return {
    url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.autocomplete.legacy}?${queryString}`,
    method: 'GET',
    headers,
    timeout,
  };
}

/**
 * Builds autocomplete request configuration for new API
 */
export function buildAutocompleteNewRequest(
  baseUrl: string,
  text: string,
  query: GooglePlacesQuery | Record<string, unknown>,
  sessionToken: string,
  headers: Readonly<Record<string, string>>,
  timeout: number,
): GooglePlacesRequestConfig {
  const keyQueryParam =
    'key' in query && query.key ? '?' + Qs.stringify({ key: query.key }) : '';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key, locationbias, types, ...rest } = query as Record<
    string,
    unknown
  >;

  return {
    url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.autocomplete.new}${keyQueryParam}`,
    method: 'POST',
    headers,
    body: JSON.stringify({
      input: text,
      sessionToken,
      ...rest,
    }),
    timeout,
  };
}

/**
 * Builds place details request configuration for legacy API
 */
export function buildPlaceDetailsLegacyRequest(
  baseUrl: string,
  placeId: string,
  query: Partial<GooglePlacesQuery> & { readonly fields?: string },
  headers: Readonly<Record<string, string>>,
  timeout: number,
): GooglePlacesRequestConfig {
  const queryString = Qs.stringify({
    place_id: placeId,
    ...query,
  });

  return {
    url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.details.legacy}?${queryString}`,
    method: 'GET',
    headers,
    timeout,
  };
}

/**
 * Builds place details request configuration for new API
 */
export function buildPlaceDetailsNewRequest(
  baseUrl: string,
  placeId: string,
  query: Partial<GooglePlacesQuery> & { readonly fields?: string },
  headers: Readonly<Record<string, string>>,
  timeout: number,
): GooglePlacesRequestConfig {
  const keyQueryParam =
    'key' in query && query.key ? '?' + Qs.stringify({ key: query.key }) : '';

  const fieldsParam = query.fields
    ? `&fields=${encodeURIComponent(query.fields)}`
    : '';

  return {
    url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.details.new}/${placeId}${keyQueryParam}${fieldsParam}`,
    method: 'GET',
    headers,
    timeout,
  };
}

/**
 * Builds nearby search request configuration
 */
export function buildNearbySearchRequest(
  baseUrl: string,
  latitude: number,
  longitude: number,
  query: Partial<GooglePlacesQuery<GooglePlacesSearchType>>,
  headers: Readonly<Record<string, string>>,
  timeout: number,
): GooglePlacesRequestConfig {
  const queryString = Qs.stringify({
    location: `${latitude},${longitude}`,
    ...query,
  });

  return {
    url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.nearby}?${queryString}`,
    method: 'GET',
    headers,
    timeout,
  };
}

/**
 * Builds reverse geocoding request configuration
 */
export function buildGeocodingRequest(
  baseUrl: string,
  latitude: number,
  longitude: number,
  query: {
    readonly key: string;
    readonly bounds?: number;
    readonly language?: GooglePlacesLanguage;
    readonly region?: string;
    readonly components?: string;
  },
  headers: Readonly<Record<string, string>>,
  timeout: number,
): GooglePlacesRequestConfig {
  const queryString = Qs.stringify({
    latlng: `${latitude},${longitude}`,
    ...query,
  });

  return {
    url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.geocoding}?${queryString}`,
    method: 'GET',
    headers,
    timeout,
  };
}

/**
 * Filters results by place types
 */
export function shouldIncludeResult(
  resultTypes: ReadonlyArray<GooglePlacesPlaceType | string>,
  filterTypes: ReadonlyArray<GooglePlacesPlaceType>,
): boolean {
  if (filterTypes.length === 0) return true;

  for (const filterType of filterTypes) {
    if (resultTypes.includes(filterType)) {
      return true;
    }
  }

  return false;
}
