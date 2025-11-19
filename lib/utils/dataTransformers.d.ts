import type { GooglePlaceData, GooglePlacesPlaceType, GooglePlacesRowData, GooglePlacesPredefinedPlace } from '../types';
export declare function filterResultsByTypes(results: ReadonlyArray<GooglePlaceData>, filterTypes: ReadonlyArray<GooglePlacesPlaceType>): ReadonlyArray<GooglePlaceData>;
export declare function transformNewApiResults(suggestions: ReadonlyArray<{
    readonly placePrediction?: {
        readonly place?: string;
        readonly placeId?: string;
        readonly text?: {
            readonly text?: string;
        };
        readonly structuredFormat?: {
            readonly mainText?: {
                readonly text?: string;
            };
            readonly secondaryText?: {
                readonly text?: string;
            };
        };
        readonly types?: ReadonlyArray<string>;
    };
}>): ReadonlyArray<GooglePlaceData>;
export declare function buildRowsFromResults(results: ReadonlyArray<GooglePlaceData>, predefinedPlaces: ReadonlyArray<GooglePlacesPredefinedPlace>, predefinedPlacesAlwaysVisible: boolean, currentLocation: boolean, currentLocationLabel: string, hasNavigatorSupport: boolean, text?: string): ReadonlyArray<GooglePlacesRowData>;
export declare function getDescriptionFromPlace(place: GooglePlaceData | {
    readonly formatted_address?: string;
    readonly name?: string;
}): string;
export declare function getPredefinedPlace(rowData: GooglePlacesRowData, predefinedPlaces: ReadonlyArray<GooglePlacesPredefinedPlace>): GooglePlacesPredefinedPlace | GooglePlacesRowData;
//# sourceMappingURL=dataTransformers.d.ts.map