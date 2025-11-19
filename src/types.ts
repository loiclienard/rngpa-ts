import type {
  ImageStyle,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

/** @see https://developers.google.com/maps/faq#languagesupport */
export type GooglePlacesLanguage =
  | 'af'
  | 'am'
  | 'ar'
  | 'az'
  | 'be'
  | 'bg'
  | 'bn'
  | 'bs'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en-AU'
  | 'en-GB'
  | 'en'
  | 'es-419'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fil'
  | 'fr-CA'
  | 'fr'
  | 'gl'
  | 'gu'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'hy'
  | 'id'
  | 'is'
  | 'it'
  | 'iw'
  | 'ja'
  | 'ka'
  | 'kk'
  | 'km'
  | 'kn'
  | 'ko'
  | 'ky'
  | 'lo'
  | 'lt'
  | 'lv'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'mr'
  | 'ms'
  | 'my'
  | 'ne'
  | 'nl'
  | 'no'
  | 'pa'
  | 'pl'
  | 'pt-BR'
  | 'pt-PT'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sq'
  | 'sr'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'te'
  | 'th'
  | 'tr'
  | 'uk'
  | 'ur'
  | 'uz'
  | 'vi'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-TW'
  | 'zh'
  | 'zu';

/** @see https://developers.google.com/places/web-service/supported_types#table1 */
export type GooglePlacesSearchType =
  | 'accounting'
  | 'airport'
  | 'amusement_park'
  | 'aquarium'
  | 'art_gallery'
  | 'atm'
  | 'bakery'
  | 'bank'
  | 'bar'
  | 'beauty_salon'
  | 'bicycle_store'
  | 'book_store'
  | 'bowling_alley'
  | 'bus_station'
  | 'cafe'
  | 'campground'
  | 'car_dealer'
  | 'car_rental'
  | 'car_repair'
  | 'car_wash'
  | 'casino'
  | 'cemetery'
  | 'church'
  | 'city_hall'
  | 'clothing_store'
  | 'convenience_store'
  | 'courthouse'
  | 'dentist'
  | 'department_store'
  | 'doctor'
  | 'drugstore'
  | 'electrician'
  | 'electronics_store'
  | 'embassy'
  | 'fire_station'
  | 'florist'
  | 'funeral_home'
  | 'furniture_store'
  | 'gas_station'
  | 'gym'
  | 'hair_care'
  | 'hardware_store'
  | 'hindu_temple'
  | 'home_goods_store'
  | 'hospital'
  | 'insurance_agency'
  | 'jewelry_store'
  | 'laundry'
  | 'lawyer'
  | 'library'
  | 'light_rail_station'
  | 'liquor_store'
  | 'local_government_office'
  | 'locksmith'
  | 'lodging'
  | 'meal_delivery'
  | 'meal_takeaway'
  | 'mosque'
  | 'movie_rental'
  | 'movie_theater'
  | 'moving_company'
  | 'museum'
  | 'night_club'
  | 'painter'
  | 'park'
  | 'parking'
  | 'pet_store'
  | 'pharmacy'
  | 'physiotherapist'
  | 'plumber'
  | 'police'
  | 'post_office'
  | 'primary_school'
  | 'real_estate_agency'
  | 'restaurant'
  | 'roofing_contractor'
  | 'rv_park'
  | 'school'
  | 'secondary_school'
  | 'shoe_store'
  | 'shopping_mall'
  | 'spa'
  | 'stadium'
  | 'storage'
  | 'store'
  | 'subway_station'
  | 'supermarket'
  | 'synagogue'
  | 'taxi_stand'
  | 'tourist_attraction'
  | 'train_station'
  | 'transit_station'
  | 'travel_agency'
  | 'university'
  | 'veterinary_care'
  | 'zoo';

/** @see https://developers.google.com/places/web-service/supported_types#table2 */
export type GooglePlacesPlaceType =
  | 'administrative_area_level_1'
  | 'administrative_area_level_2'
  | 'administrative_area_level_3'
  | 'administrative_area_level_4'
  | 'administrative_area_level_5'
  | 'archipelago'
  | 'colloquial_area'
  | 'continent'
  | 'country'
  | 'establishment'
  | 'finance'
  | 'floor'
  | 'food'
  | 'general_contractor'
  | 'geocode'
  | 'health'
  | 'intersection'
  | 'locality'
  | 'natural_feature'
  | 'neighborhood'
  | 'place_of_worship'
  | 'plus_code'
  | 'point_of_interest'
  | 'political'
  | 'post_box'
  | 'postal_code'
  | 'postal_code_prefix'
  | 'postal_code_suffix'
  | 'postal_town'
  | 'premise'
  | 'room'
  | 'route'
  | 'street_address'
  | 'street_number'
  | 'sublocality'
  | 'sublocality_level_1'
  | 'sublocality_level_2'
  | 'sublocality_level_3'
  | 'sublocality_level_4'
  | 'sublocality_level_5'
  | 'subpremise'
  | 'town_square';

/** @see https://developers.google.com/places/web-service/supported_types#table3 */
export type GooglePlacesAutocompleteRequestType =
  | '(regions)'
  | '(cities)'
  | 'geocode'
  | 'address'
  | 'establishment';

export interface GooglePlacesMatchedSubstring {
  readonly length: number;
  readonly offset: number;
}

export interface GooglePlacesTerm {
  readonly offset: number;
  readonly value: string;
}

export interface GooglePlacesStructuredFormatting {
  readonly main_text: string;
  readonly main_text_matched_substrings: ReadonlyArray<Record<string, unknown>>;
  readonly secondary_text: string;
  readonly secondary_text_matched_substrings: ReadonlyArray<
    Record<string, unknown>
  >;
}

export interface GooglePlaceData {
  readonly description: string;
  readonly id: string;
  readonly matched_substrings: ReadonlyArray<GooglePlacesMatchedSubstring>;
  readonly place_id: string;
  readonly reference: string;
  readonly structured_formatting: GooglePlacesStructuredFormatting;
  readonly terms: ReadonlyArray<GooglePlacesTerm>;
  readonly types: ReadonlyArray<GooglePlacesPlaceType>;
}

export interface GooglePlacesPoint {
  readonly lat: number;
  readonly lng: number;
  readonly latitude: number;
  readonly longitude: number;
}

export interface GooglePlacesAddressComponent {
  readonly long_name: string;
  readonly short_name: string;
  readonly longText: string;
  readonly shortText: string;
  readonly types: ReadonlyArray<GooglePlacesPlaceType>;
}

export interface GooglePlacesGeometry {
  readonly location: GooglePlacesPoint;
  readonly viewport: {
    readonly northeast: GooglePlacesPoint;
    readonly southwest: GooglePlacesPoint;
  };
}

export interface GooglePlacesPlusCode {
  readonly compound_code: string;
  readonly global_code: string;
}

export interface GooglePlaceDetail {
  readonly address_components: ReadonlyArray<GooglePlacesAddressComponent>;
  readonly adr_address: string;
  readonly formatted_address: string;
  readonly geometry: GooglePlacesGeometry;
  readonly icon: string;
  readonly id: string;
  readonly name: string;
  readonly place_id: string;
  readonly plus_code: GooglePlacesPlusCode;
  readonly reference: string;
  readonly scope: 'GOOGLE';
  readonly types: ReadonlyArray<GooglePlacesPlaceType>;
  readonly url: string;
  readonly utc_offset: number;
  readonly vicinity: string;
  // New Places API parameters
  readonly addressComponents?: ReadonlyArray<GooglePlacesAddressComponent>;
  readonly adrFormatAddress?: string;
  readonly formattedAddress?: string;
  readonly location?: GooglePlacesPoint;
}

/** @see https://developers.google.com/places/web-service/autocomplete */
export interface GooglePlacesQuery<T = GooglePlacesAutocompleteRequestType> {
  readonly key: string;
  readonly sessiontoken?: string;
  readonly offset?: number;
  readonly location?: string;
  readonly radius?: number;
  readonly language?: GooglePlacesLanguage;
  readonly components?: string;
  readonly rankby?: string;
  readonly type?: T;
  readonly strictbounds?: boolean;
  /** @deprecated @see https://github.com/FaridSafi/react-native-google-places-autocomplete/pull/384 */
  readonly types?: T;
}

export interface GooglePlacesAutocompleteStyles {
  readonly container?: StyleProp<ViewStyle>;
  readonly description?: StyleProp<TextStyle>;
  readonly textInputContainer?: StyleProp<ViewStyle>;
  readonly textInput?: StyleProp<TextStyle>;
  readonly loader?: StyleProp<ViewStyle>;
  readonly listView?: StyleProp<ViewStyle>;
  readonly predefinedPlacesDescription?: StyleProp<TextStyle>;
  readonly poweredContainer?: StyleProp<ViewStyle>;
  readonly powered?: StyleProp<ImageStyle>;
  readonly separator?: StyleProp<ViewStyle>;
  readonly row?: StyleProp<ViewStyle>;
}

export interface GooglePlacesPredefinedPlace {
  readonly description: string;
  readonly geometry: {
    readonly location: GooglePlacesPoint;
  };
}

export interface GooglePlacesRequestUrl {
  readonly url: string;
  readonly useOnPlatform: 'web' | 'all';
  readonly headers?: Readonly<Record<string, string>>;
}

export interface GooglePlacesAutocompleteProps {
  readonly autoFillOnNotFound?: boolean;
  readonly children?: React.ReactNode;
  readonly currentLocation?: boolean;
  readonly currentLocationLabel?: string;
  readonly debounce?: number;
  readonly disableScroll?: boolean;
  readonly enableHighAccuracyLocation?: boolean;
  readonly enablePoweredByContainer?: boolean;
  readonly fetchDetails?: boolean;
  readonly filterReverseGeocodingByTypes?: ReadonlyArray<GooglePlacesPlaceType>;
  readonly GooglePlacesDetailsQuery?: Partial<GooglePlacesQuery> & {
    readonly fields?: string;
  };
  readonly GooglePlacesSearchQuery?: Partial<
    GooglePlacesQuery<GooglePlacesSearchType>
  >;
  readonly GoogleReverseGeocodingQuery?: {
    readonly bounds?: number;
    readonly language?: GooglePlacesLanguage;
    readonly region?: string;
    readonly components?: string;
  };
  readonly inbetweenCompo?: React.ReactNode;
  readonly isRowScrollable?: boolean;
  readonly keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  readonly listEmptyComponent?: React.ReactNode;
  readonly listLoaderComponent?: React.ReactNode;
  readonly listHoverColor?: string;
  readonly listUnderlayColor?: string;
  readonly listViewDisplayed?: 'auto' | boolean;
  readonly minLength?: number;
  readonly keepResultsAfterBlur?: boolean;
  readonly nearbyPlacesAPI?:
    | 'GoogleReverseGeocoding'
    | 'GooglePlacesSearch'
    | 'None';
  readonly numberOfLines?: number;
  readonly onFail?: (error: GooglePlacesApiError) => void;
  readonly onNotFound?: () => void;
  readonly onPress?: (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => void;
  readonly onTimeout?: () => void;
  readonly placeholder: string;
  readonly predefinedPlaces?: ReadonlyArray<GooglePlacesPredefinedPlace>;
  readonly predefinedPlacesAlwaysVisible?: boolean;
  readonly preProcess?: (text: string) => string;
  readonly query: GooglePlacesQuery | Record<string, unknown>;
  readonly renderDescription?: (description: GooglePlaceData) => string;
  readonly renderHeaderComponent?: () => React.ReactNode;
  readonly renderLeftButton?: () => React.ReactNode;
  readonly renderRightButton?: () => React.ReactNode;
  readonly renderRow?: (
    data: GooglePlaceData,
    index: number,
  ) => React.ReactNode;
  readonly requestUrl?: GooglePlacesRequestUrl;
  readonly styles?: GooglePlacesAutocompleteStyles;
  readonly suppressDefaultStyles?: boolean;
  readonly textInputHide?: boolean;
  readonly textInputProps?: TextInputProps;
  readonly timeout?: number;
  readonly isNewPlacesAPI?: boolean;
  readonly fields?: string;
}

export interface GooglePlacesAutocompleteRef extends TextInput {
  setAddressText(address: string): void;
  getAddressText(): string;
  getCurrentLocation(): void;
}

// Internal types for row data
export interface GooglePlacesRowData extends GooglePlaceData {
  readonly isPredefinedPlace?: boolean;
  readonly isCurrentLocation?: boolean;
  readonly isLoading?: boolean;
}

// API Error types - discriminated union for robust error handling
export type GooglePlacesApiError =
  | GooglePlacesNetworkError
  | GooglePlacesTimeoutError
  | GooglePlacesApiResponseError
  | GooglePlacesAbortError;

export interface GooglePlacesNetworkError {
  readonly type: 'network';
  readonly message: string;
  readonly originalError: Error;
}

export interface GooglePlacesTimeoutError {
  readonly type: 'timeout';
  readonly message: string;
  readonly timeoutMs: number;
}

export interface GooglePlacesApiResponseError {
  readonly type: 'api_response';
  readonly message: string;
  readonly status: string;
  readonly responseBody?: unknown;
}

export interface GooglePlacesAbortError {
  readonly type: 'abort';
  readonly message: string;
}

// API Response types - discriminated unions for legacy vs new API
export type GooglePlacesAutocompleteResponse =
  | GooglePlacesAutocompleteLegacyResponse
  | GooglePlacesAutocompleteNewResponse;

export interface GooglePlacesAutocompleteLegacyResponse {
  readonly apiVersion: 'legacy';
  readonly status: string;
  readonly predictions: ReadonlyArray<GooglePlaceData>;
}

export interface GooglePlacesAutocompleteNewResponse {
  readonly apiVersion: 'new';
  readonly suggestions: ReadonlyArray<{
    readonly placePrediction: {
      readonly place: string;
      readonly placeId: string;
      readonly text: {
        readonly text: string;
      };
      readonly structuredFormat: {
        readonly mainText: {
          readonly text: string;
        };
        readonly secondaryText: {
          readonly text: string;
        };
      };
      readonly types: ReadonlyArray<string>;
    };
  }>;
}

export type GooglePlacesDetailsResponse =
  | GooglePlacesDetailsLegacyResponse
  | GooglePlacesDetailsNewResponse;

export interface GooglePlacesDetailsLegacyResponse {
  readonly apiVersion: 'legacy';
  readonly status: string;
  readonly result: GooglePlaceDetail;
}

export interface GooglePlacesDetailsNewResponse {
  readonly apiVersion: 'new';
  readonly id: string;
  readonly formattedAddress: string;
  readonly addressComponents: ReadonlyArray<GooglePlacesAddressComponent>;
  readonly location: GooglePlacesPoint;
}

// Result type for API operations
export type Result<T, E> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// Request configuration
export interface GooglePlacesRequestConfig {
  readonly url: string;
  readonly method: 'GET' | 'POST';
  readonly headers: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly timeout: number;
}
