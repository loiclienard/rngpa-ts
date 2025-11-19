import type {
  GooglePlaceData,
  GooglePlacesPlaceType,
  GooglePlacesRowData,
  GooglePlacesPredefinedPlace,
} from '../types';

/**
 * Filters results by specified place types
 */
export function filterResultsByTypes(
  results: ReadonlyArray<GooglePlaceData>,
  filterTypes: ReadonlyArray<GooglePlacesPlaceType>,
): ReadonlyArray<GooglePlaceData> {
  if (filterTypes.length === 0) {
    return results;
  }

  return results.filter((result) => {
    for (const filterType of filterTypes) {
      if (result.types.includes(filterType)) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Transforms new API suggestions format to legacy format
 */
export function transformNewApiResults(
  suggestions: ReadonlyArray<{
    readonly placePrediction?: {
      readonly place?: string;
      readonly placeId?: string;
      readonly text?: { readonly text?: string };
      readonly structuredFormat?: {
        readonly mainText?: { readonly text?: string };
        readonly secondaryText?: { readonly text?: string };
      };
      readonly types?: ReadonlyArray<string>;
    };
  }>,
): ReadonlyArray<GooglePlaceData> {
  const results: GooglePlaceData[] = [];

  for (const suggestion of suggestions) {
    if (suggestion.placePrediction) {
      const pred = suggestion.placePrediction;
      results.push({
        description: pred.text?.text ?? '',
        place_id: pred.placeId ?? '',
        reference: pred.placeId ?? '',
        id: pred.placeId ?? '',
        matched_substrings: [],
        structured_formatting: {
          main_text: pred.structuredFormat?.mainText?.text ?? '',
          main_text_matched_substrings: [],
          secondary_text: pred.structuredFormat?.secondaryText?.text ?? '',
          secondary_text_matched_substrings: [],
        },
        terms: [],
        types: (pred.types ?? []) as GooglePlacesPlaceType[],
      });
    }
  }

  return results;
}

/**
 * Builds rows from results, including predefined places
 */
export function buildRowsFromResults(
  results: ReadonlyArray<GooglePlaceData>,
  predefinedPlaces: ReadonlyArray<GooglePlacesPredefinedPlace>,
  predefinedPlacesAlwaysVisible: boolean,
  currentLocation: boolean,
  currentLocationLabel: string,
  hasNavigatorSupport: boolean,
  text?: string,
): ReadonlyArray<GooglePlacesRowData> {
  const rows: GooglePlacesRowData[] = [];

  // Determine if we should display predefined places
  const shouldDisplayPredefinedPlaces = text
    ? results.length === 0 && text.length === 0
    : results.length === 0;

  if (shouldDisplayPredefinedPlaces || predefinedPlacesAlwaysVisible) {
    // Add current location button if enabled
    if (currentLocation && hasNavigatorSupport) {
      rows.push({
        description: currentLocationLabel,
        id: 'current-location',
        place_id: 'current-location',
        reference: 'current-location',
        matched_substrings: [],
        structured_formatting: {
          main_text: currentLocationLabel,
          main_text_matched_substrings: [],
          secondary_text: '',
          secondary_text_matched_substrings: [],
        },
        terms: [],
        types: [],
        isCurrentLocation: true,
        isPredefinedPlace: true,
      });
    }

    // Add predefined places
    for (const place of predefinedPlaces) {
      if (place.description && place.description.length > 0) {
        rows.push({
          description: place.description,
          id: place.description,
          place_id: place.description,
          reference: place.description,
          matched_substrings: [],
          structured_formatting: {
            main_text: place.description,
            main_text_matched_substrings: [],
            secondary_text: '',
            secondary_text_matched_substrings: [],
          },
          terms: [],
          types: [],
          isPredefinedPlace: true,
        });
      }
    }
  }

  // Add API results
  for (const result of results) {
    rows.push({
      ...result,
    });
  }

  return rows;
}

/**
 * Extracts description from a place object
 */
export function getDescriptionFromPlace(
  place:
    | GooglePlaceData
    | { readonly formatted_address?: string; readonly name?: string },
): string {
  if ('description' in place) {
    return place.description;
  }
  if ('formatted_address' in place) {
    return place.formatted_address ?? '';
  }
  if ('name' in place) {
    return place.name ?? '';
  }
  return '';
}

/**
 * Finds a predefined place by description
 */
export function getPredefinedPlace(
  rowData: GooglePlacesRowData,
  predefinedPlaces: ReadonlyArray<GooglePlacesPredefinedPlace>,
): GooglePlacesPredefinedPlace | GooglePlacesRowData {
  if (!rowData.isPredefinedPlace) {
    return rowData;
  }

  for (const place of predefinedPlaces) {
    if (place.description === rowData.description) {
      return place;
    }
  }

  return rowData;
}
