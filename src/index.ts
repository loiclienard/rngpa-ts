// Main component
export { GooglePlacesAutocomplete } from './components/GooglePlacesAutocomplete';

// Re-export all types with descriptive prefixes
export type {
  GooglePlacesLanguage,
  GooglePlacesSearchType,
  GooglePlacesPlaceType,
  GooglePlacesAutocompleteRequestType,
  GooglePlacesMatchedSubstring,
  GooglePlacesTerm,
  GooglePlacesStructuredFormatting,
  GooglePlaceData,
  GooglePlacesPoint,
  GooglePlacesAddressComponent,
  GooglePlacesGeometry,
  GooglePlacesPlusCode,
  GooglePlaceDetail,
  GooglePlacesQuery,
  GooglePlacesAutocompleteStyles,
  GooglePlacesPredefinedPlace,
  GooglePlacesRequestUrl,
  GooglePlacesAutocompleteProps,
  GooglePlacesAutocompleteRef,
  GooglePlacesRowData,
  GooglePlacesApiError,
  GooglePlacesNetworkError,
  GooglePlacesTimeoutError,
  GooglePlacesApiResponseError,
  GooglePlacesAbortError,
  GooglePlacesAutocompleteResponse,
  GooglePlacesAutocompleteLegacyResponse,
  GooglePlacesAutocompleteNewResponse,
  GooglePlacesDetailsResponse,
  GooglePlacesDetailsLegacyResponse,
  GooglePlacesDetailsNewResponse,
  GooglePlacesRequestConfig,
  Result,
} from './types';

// Re-export constants for advanced usage
export { GOOGLE_PLACES_DEFAULT_STYLES } from './constants/styles';

export {
  GOOGLE_PLACES_DEFAULT_DEBOUNCE,
  GOOGLE_PLACES_DEFAULT_TIMEOUT,
  GOOGLE_PLACES_DEFAULT_MIN_LENGTH,
  GOOGLE_PLACES_DEFAULT_NUMBER_OF_LINES,
  GOOGLE_PLACES_DEFAULT_KEYBOARD_PERSIST,
  GOOGLE_PLACES_DEFAULT_LIST_VIEW_DISPLAYED,
  GOOGLE_PLACES_DEFAULT_NEARBY_API,
  GOOGLE_PLACES_CURRENT_LOCATION_LABEL,
  GOOGLE_PLACES_GEOLOCATION_OPTIONS,
} from './constants/defaults';

export {
  GOOGLE_PLACES_API_BASE_URL,
  GOOGLE_PLACES_ENDPOINTS,
  GOOGLE_PLACES_DEFAULT_QUERY_PARAMS,
} from './constants/api';
