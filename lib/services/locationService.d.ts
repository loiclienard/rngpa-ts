import type { GooglePlacesApiError, Result } from '../types';
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
export declare function getCurrentLocation(enableHighAccuracy: boolean): Promise<Result<GeolocationPosition, GooglePlacesApiError>>;
//# sourceMappingURL=locationService.d.ts.map