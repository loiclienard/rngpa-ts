import type { GooglePlacesQuery, GooglePlacesRequestConfig, GooglePlacesSearchType, GooglePlacesPlaceType, GooglePlacesLanguage } from '../types';
export declare function buildAutocompleteLegacyRequest(baseUrl: string, text: string, query: GooglePlacesQuery | Record<string, unknown>, headers: Readonly<Record<string, string>>, timeout: number): GooglePlacesRequestConfig;
export declare function buildAutocompleteNewRequest(baseUrl: string, text: string, query: GooglePlacesQuery | Record<string, unknown>, sessionToken: string, headers: Readonly<Record<string, string>>, timeout: number): GooglePlacesRequestConfig;
export declare function buildPlaceDetailsLegacyRequest(baseUrl: string, placeId: string, query: Partial<GooglePlacesQuery> & {
    readonly fields?: string;
}, headers: Readonly<Record<string, string>>, timeout: number): GooglePlacesRequestConfig;
export declare function buildPlaceDetailsNewRequest(baseUrl: string, placeId: string, query: Partial<GooglePlacesQuery> & {
    readonly fields?: string;
}, headers: Readonly<Record<string, string>>, timeout: number): GooglePlacesRequestConfig;
export declare function buildNearbySearchRequest(baseUrl: string, latitude: number, longitude: number, query: Partial<GooglePlacesQuery<GooglePlacesSearchType>>, headers: Readonly<Record<string, string>>, timeout: number): GooglePlacesRequestConfig;
export declare function buildGeocodingRequest(baseUrl: string, latitude: number, longitude: number, query: {
    readonly key: string;
    readonly bounds?: number;
    readonly language?: GooglePlacesLanguage;
    readonly region?: string;
    readonly components?: string;
}, headers: Readonly<Record<string, string>>, timeout: number): GooglePlacesRequestConfig;
export declare function shouldIncludeResult(resultTypes: ReadonlyArray<GooglePlacesPlaceType | string>, filterTypes: ReadonlyArray<GooglePlacesPlaceType>): boolean;
//# sourceMappingURL=endpoints.d.ts.map