import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';
import type {
  GooglePlacesAutocompleteProps,
  GooglePlaceData,
  GooglePlacesRowData,
  GooglePlaceDetail,
} from '../types';
import {
  makeGooglePlacesRequest,
  createAbortController,
  abortAllRequests,
} from '../api/apiService';
import {
  buildAutocompleteLegacyRequest,
  buildAutocompleteNewRequest,
  buildPlaceDetailsLegacyRequest,
  buildPlaceDetailsNewRequest,
  buildNearbySearchRequest,
  buildGeocodingRequest,
} from '../api/endpoints';
import { determineApiUrl, extractCustomHeaders } from '../utils/urlUtils';
import {
  filterResultsByTypes,
  transformNewApiResults,
  buildRowsFromResults,
  getDescriptionFromPlace,
  getPredefinedPlace,
} from '../utils/dataTransformers';
import { getCurrentLocation as getGeoLocation } from '../services/locationService';
import {
  isPlatformSupported,
  hasGeolocationSupport,
} from '../utils/validators';
import {
  GOOGLE_PLACES_DEFAULT_TIMEOUT,
  GOOGLE_PLACES_DEFAULT_MIN_LENGTH,
  GOOGLE_PLACES_DEFAULT_DEBOUNCE,
  GOOGLE_PLACES_CURRENT_LOCATION_LABEL,
} from '../constants/defaults';

export interface UseGooglePlacesAutocompleteReturn {
  text: string;
  dataSource: ReadonlyArray<GooglePlacesRowData>;
  listViewDisplayed: boolean | 'auto';
  loading: boolean;
  handleChangeText: (text: string) => void;
  handlePress: (rowData: GooglePlacesRowData) => void;
  handleBlur: () => void;
  handleFocus: () => void;
  setText: (text: string) => void;
  getText: () => string;
  setSessionToken: (token: string) => void;
}

export function useGooglePlacesAutocomplete(
  props: GooglePlacesAutocompleteProps,
): UseGooglePlacesAutocompleteReturn {
  // Extract props with defaults
  const {
    requestUrl,
    query,
    isNewPlacesAPI = false,
    timeout = GOOGLE_PLACES_DEFAULT_TIMEOUT,
    minLength = GOOGLE_PLACES_DEFAULT_MIN_LENGTH,
    debounce: debounceMs = GOOGLE_PLACES_DEFAULT_DEBOUNCE,
    currentLocation = false,
    currentLocationLabel = GOOGLE_PLACES_CURRENT_LOCATION_LABEL,
    predefinedPlaces = [],
    predefinedPlacesAlwaysVisible = false,
    fetchDetails = false,
    GooglePlacesDetailsQuery = {},
    nearbyPlacesAPI = 'GooglePlacesSearch',
    GooglePlacesSearchQuery = {},
    GoogleReverseGeocodingQuery = {},
    filterReverseGeocodingByTypes = [],
    enableHighAccuracyLocation = true,
    listViewDisplayed: initialListViewDisplayed = 'auto',
    keepResultsAfterBlur = false,
    preProcess,
    onPress,
    onFail,
    onTimeout,
  } = props;

  // State
  const [text, setText] = useState('');
  const [dataSource, setDataSource] = useState<
    ReadonlyArray<GooglePlacesRowData>
  >([]);
  const [listViewDisplayed, setListViewDisplayed] = useState<boolean | 'auto'>(
    initialListViewDisplayed === 'auto' ? false : initialListViewDisplayed,
  );
  const [url, setUrl] = useState(determineApiUrl(requestUrl));
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState(uuidv4());

  // Refs
  const abortControllersRef = useRef<AbortController[]>([]);
  const resultsRef = useRef<ReadonlyArray<GooglePlaceData>>([]);

  // Update URL when requestUrl changes
  useEffect(() => {
    setUrl(determineApiUrl(requestUrl));
  }, [requestUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortAllRequests(abortControllersRef.current);
    };
  }, []);

  // Update dataSource when query or predefinedPlaces change
  useEffect(() => {
    const rows = buildRowsFromResults(
      resultsRef.current,
      predefinedPlaces,
      predefinedPlacesAlwaysVisible,
      currentLocation,
      currentLocationLabel,
      hasGeolocationSupport(),
      text,
    );
    setDataSource(rows);
  }, [
    predefinedPlaces,
    predefinedPlacesAlwaysVisible,
    currentLocation,
    currentLocationLabel,
    text,
  ]);

  // Abort all active requests
  const abortRequests = useCallback(() => {
    abortAllRequests(abortControllersRef.current);
    abortControllersRef.current = [];
  }, []);

  // Enable row loader for a specific row
  const enableRowLoader = useCallback((rowData: GooglePlacesRowData) => {
    setDataSource((prev: ReadonlyArray<GooglePlacesRowData>) =>
      prev.map((row: GooglePlacesRowData) =>
        row.place_id === rowData.place_id ? { ...row, isLoading: true } : row,
      ),
    );
  }, []);

  // Disable all row loaders
  const disableRowLoaders = useCallback(() => {
    setDataSource((prev: ReadonlyArray<GooglePlacesRowData>) =>
      prev.map((row: GooglePlacesRowData) => {
        if (row.isLoading) {
          const { isLoading: _isLoading, ...rest } = row;
          return rest;
        }
        return row;
      }),
    );
  }, []);

  // Request nearby places
  const requestNearby = useCallback(
    async (latitude: number, longitude: number) => {
      abortRequests();

      if (latitude == null || longitude == null) {
        resultsRef.current = [];
        const rows = buildRowsFromResults(
          [],
          predefinedPlaces,
          predefinedPlacesAlwaysVisible,
          currentLocation,
          currentLocationLabel,
          hasGeolocationSupport(),
        );
        setDataSource(rows);
        return;
      }

      const controller = createAbortController();
      abortControllersRef.current.push(controller);

      const headers = extractCustomHeaders(requestUrl);
      const requestConfig =
        nearbyPlacesAPI === 'GoogleReverseGeocoding'
          ? buildGeocodingRequest(
              url,
              latitude,
              longitude,
              {
                key: ('key' in query ? query.key : undefined) as string,
                ...GoogleReverseGeocodingQuery,
              },
              headers,
              timeout,
            )
          : buildNearbySearchRequest(
              url,
              latitude,
              longitude,
              {
                key: ('key' in query ? query.key : undefined) as string,
                ...GooglePlacesSearchQuery,
              },
              headers,
              timeout,
            );

      setLoading(true);

      const result = await makeGooglePlacesRequest<{
        results?: GooglePlaceData[];
        error_message?: string;
      }>(requestConfig, controller.signal);

      setLoading(false);
      disableRowLoaders();

      if (result.success) {
        const responseJSON = result.data;

        if (responseJSON.results) {
          let results: ReadonlyArray<GooglePlaceData> = responseJSON.results;

          if (nearbyPlacesAPI === 'GoogleReverseGeocoding') {
            results = filterResultsByTypes(
              results,
              filterReverseGeocodingByTypes,
            );
          }

          resultsRef.current = results;
          const rows = buildRowsFromResults(
            results,
            predefinedPlaces,
            predefinedPlacesAlwaysVisible,
            currentLocation,
            currentLocationLabel,
            hasGeolocationSupport(),
          );
          setDataSource(rows);
        }

        if (responseJSON.error_message) {
          if (onFail) {
            onFail({
              type: 'api_response',
              message: responseJSON.error_message,
              status: 'error',
            });
          } else {
            console.warn(
              'Google Places API error:',
              responseJSON.error_message,
            );
          }
        }
      } else if (result.error.type === 'timeout' && onTimeout) {
        onTimeout();
      } else if (onFail) {
        onFail(result.error);
      }
    },
    [
      url,
      query,
      nearbyPlacesAPI,
      GoogleReverseGeocodingQuery,
      GooglePlacesSearchQuery,
      filterReverseGeocodingByTypes,
      predefinedPlaces,
      predefinedPlacesAlwaysVisible,
      currentLocation,
      currentLocationLabel,
      requestUrl,
      timeout,
      onFail,
      onTimeout,
      abortRequests,
      disableRowLoaders,
    ],
  );

  // Handle get current location
  const handleGetCurrentLocation = useCallback(async () => {
    const result = await getGeoLocation(enableHighAccuracyLocation);

    if (result.success) {
      const { latitude, longitude } = result.data.coords;

      if (nearbyPlacesAPI === 'None') {
        const currentLocationPlace = {
          description: currentLocationLabel,
          geometry: {
            location: {
              lat: latitude,
              lng: longitude,
              latitude,
              longitude,
            },
          },
        };

        disableRowLoaders();
        if (onPress) {
          // CurrentLocationPlace structure is compatible with GooglePlaceData for onPress
          onPress(currentLocationPlace as unknown as GooglePlaceData, null);
        }
      } else {
        await requestNearby(latitude, longitude);
      }
    } else {
      disableRowLoaders();
      console.error('Geolocation error:', result.error.message);
    }
  }, [
    enableHighAccuracyLocation,
    nearbyPlacesAPI,
    currentLocationLabel,
    onPress,
    requestNearby,
    disableRowLoaders,
  ]);

  // Request autocomplete
  const request = useCallback(
    async (searchText: string) => {
      abortRequests();

      if (!url) {
        return;
      }

      if (!isPlatformSupported(!!requestUrl)) {
        return;
      }

      if (!searchText || searchText.length < minLength) {
        resultsRef.current = [];
        const rows = buildRowsFromResults(
          [],
          predefinedPlaces,
          predefinedPlacesAlwaysVisible,
          currentLocation,
          currentLocationLabel,
          hasGeolocationSupport(),
        );
        setDataSource(rows);
        return;
      }

      const controller = createAbortController();
      abortControllersRef.current.push(controller);

      const headers = extractCustomHeaders(requestUrl);
      const requestConfig = isNewPlacesAPI
        ? buildAutocompleteNewRequest(
            url,
            searchText,
            query,
            sessionToken,
            headers,
            timeout,
          )
        : buildAutocompleteLegacyRequest(
            url,
            searchText,
            query,
            headers,
            timeout,
          );

      setLoading(true);

      const result = await makeGooglePlacesRequest<{
        predictions?: GooglePlaceData[];
        suggestions?: Array<Record<string, unknown>>;
        error_message?: string;
        status?: string;
      }>(requestConfig, controller.signal);

      setLoading(false);

      if (result.success) {
        const responseJSON = result.data;

        if (responseJSON.predictions) {
          let results: ReadonlyArray<GooglePlaceData> =
            responseJSON.predictions;

          if (nearbyPlacesAPI === 'GoogleReverseGeocoding') {
            results = filterResultsByTypes(
              results,
              filterReverseGeocodingByTypes,
            );
          }

          resultsRef.current = results;
          const rows = buildRowsFromResults(
            results,
            predefinedPlaces,
            predefinedPlacesAlwaysVisible,
            currentLocation,
            currentLocationLabel,
            hasGeolocationSupport(),
            searchText,
          );
          setDataSource(rows);
        } else if (responseJSON.suggestions) {
          const results = transformNewApiResults(responseJSON.suggestions);
          resultsRef.current = results;
          const rows = buildRowsFromResults(
            results,
            predefinedPlaces,
            predefinedPlacesAlwaysVisible,
            currentLocation,
            currentLocationLabel,
            hasGeolocationSupport(),
            searchText,
          );
          setDataSource(rows);
        }

        if (responseJSON.error_message) {
          if (onFail) {
            onFail({
              type: 'api_response',
              message: responseJSON.error_message,
              status: responseJSON.status ?? 'error',
            });
          } else {
            console.warn(
              'Google Places API error:',
              responseJSON.error_message,
            );
          }
        }
      } else if (result.error.type === 'timeout' && onTimeout) {
        onTimeout();
      } else if (onFail && result.error.type !== 'abort') {
        onFail(result.error);
      }
    },
    [
      url,
      query,
      sessionToken,
      isNewPlacesAPI,
      minLength,
      nearbyPlacesAPI,
      filterReverseGeocodingByTypes,
      predefinedPlaces,
      predefinedPlacesAlwaysVisible,
      currentLocation,
      currentLocationLabel,
      requestUrl,
      timeout,
      onFail,
      onTimeout,
      abortRequests,
    ],
  );

  // Debounced request
  const debouncedRequest = useMemo(
    () => debounce(request, debounceMs),
    [request, debounceMs],
  );

  // Handle text change
  const handleChangeText = useCallback(
    (newText: string) => {
      const processedText = preProcess ? preProcess(newText) : newText;
      setText(processedText);
      debouncedRequest(processedText);
    },
    [preProcess, debouncedRequest],
  );

  // Fetch place details
  const fetchPlaceDetails = useCallback(
    async (placeId: string) => {
      const controller = createAbortController();
      abortControllersRef.current.push(controller);

      const headers = extractCustomHeaders(requestUrl);
      const detailsQuery = {
        key: ('key' in query ? query.key : undefined) as string,
        ...GooglePlacesDetailsQuery,
      };

      const requestConfig = isNewPlacesAPI
        ? buildPlaceDetailsNewRequest(
            url,
            placeId,
            detailsQuery,
            headers,
            timeout,
          )
        : buildPlaceDetailsLegacyRequest(
            url,
            placeId,
            detailsQuery,
            headers,
            timeout,
          );

      const result = await makeGooglePlacesRequest<
        { status: string; result: GooglePlaceDetail } | GooglePlaceDetail
      >(requestConfig, controller.signal);

      if (result.success) {
        const details =
          'result' in result.data ? result.data.result : result.data;

        // Generate new session token after fetching details (for new API)
        if (isNewPlacesAPI) {
          setSessionToken(uuidv4());
        }

        return details;
      } else if (result.error.type === 'timeout' && onTimeout) {
        onTimeout();
      } else if (onFail) {
        onFail(result.error);
      }

      return null;
    },
    [
      url,
      query,
      isNewPlacesAPI,
      GooglePlacesDetailsQuery,
      requestUrl,
      timeout,
      onFail,
      onTimeout,
    ],
  );

  // Handle blur
  const handleBlur = useCallback(
    (e?: {
      relatedTarget?: EventTarget & { parentNode?: Node; id?: string };
    }) => {
      // Check if focus is moving to another element in the results list
      if (e?.relatedTarget) {
        let node: Node | undefined | null = e.relatedTarget.parentNode;
        while (node) {
          if (node instanceof Element && node.id === 'result-list-id') {
            return;
          }
          node = node.parentNode;
        }
      }

      if (!keepResultsAfterBlur) {
        setListViewDisplayed(false);
      }
    },
    [keepResultsAfterBlur],
  );

  // Handle row press
  const handlePress = useCallback(
    async (rowData: GooglePlacesRowData) => {
      // Handle current location
      if (rowData.isCurrentLocation) {
        enableRowLoader(rowData);
        await handleGetCurrentLocation();
        return;
      }

      // Handle predefined place without fetchDetails
      if (rowData.isPredefinedPlace && !fetchDetails) {
        const place = getPredefinedPlace(rowData, predefinedPlaces);
        const description =
          'description' in place
            ? place.description
            : getDescriptionFromPlace(place);
        setText(description);
        if (onPress) {
          // Predefined places have a different structure than GooglePlaceData
          // but are compatible for the onPress callback
          // Predefined places have compatible structure for onPress callback
          onPress(place as GooglePlaceData, null);
        }
        handleBlur();
        return;
      }

      // Handle regular place or predefined with fetchDetails
      if (fetchDetails && !rowData.isLoading) {
        abortRequests();
        enableRowLoader(rowData);

        const details = await fetchPlaceDetails(rowData.place_id);

        disableRowLoaders();
        handleBlur();
        setText(getDescriptionFromPlace(rowData));

        if (onPress) {
          onPress(rowData, details);
        }
      } else if (!fetchDetails) {
        setText(getDescriptionFromPlace(rowData));
        if (onPress) {
          onPress(rowData, null);
        }
        handleBlur();
      }
    },
    [
      fetchDetails,
      enableRowLoader,
      handleGetCurrentLocation,
      predefinedPlaces,
      onPress,
      handleBlur,
      abortRequests,
      fetchPlaceDetails,
      disableRowLoaders,
    ],
  );

  // Handle focus
  const handleFocus = useCallback(() => {
    setListViewDisplayed(true);
  }, []);

  // Public API
  const getText = useCallback(() => text, [text]);

  return {
    text,
    dataSource,
    listViewDisplayed,
    loading,
    handleChangeText,
    handlePress,
    handleBlur,
    handleFocus,
    setText,
    getText,
    setSessionToken,
  };
}
