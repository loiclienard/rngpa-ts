var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';
import { makeGooglePlacesRequest, createAbortController, abortAllRequests, } from '../api/apiService';
import { buildAutocompleteLegacyRequest, buildAutocompleteNewRequest, buildPlaceDetailsLegacyRequest, buildPlaceDetailsNewRequest, buildNearbySearchRequest, buildGeocodingRequest, } from '../api/endpoints';
import { determineApiUrl, extractCustomHeaders } from '../utils/urlUtils';
import { filterResultsByTypes, transformNewApiResults, buildRowsFromResults, getDescriptionFromPlace, getPredefinedPlace, } from '../utils/dataTransformers';
import { getCurrentLocation as getGeoLocation } from '../services/locationService';
import { isPlatformSupported, hasGeolocationSupport, } from '../utils/validators';
import { GOOGLE_PLACES_DEFAULT_TIMEOUT, GOOGLE_PLACES_DEFAULT_MIN_LENGTH, GOOGLE_PLACES_DEFAULT_DEBOUNCE, GOOGLE_PLACES_CURRENT_LOCATION_LABEL, } from '../constants/defaults';
export function useGooglePlacesAutocomplete(props) {
    const { requestUrl, query, isNewPlacesAPI = false, timeout = GOOGLE_PLACES_DEFAULT_TIMEOUT, minLength = GOOGLE_PLACES_DEFAULT_MIN_LENGTH, debounce: debounceMs = GOOGLE_PLACES_DEFAULT_DEBOUNCE, currentLocation = false, currentLocationLabel = GOOGLE_PLACES_CURRENT_LOCATION_LABEL, predefinedPlaces = [], predefinedPlacesAlwaysVisible = false, fetchDetails = false, GooglePlacesDetailsQuery = {}, nearbyPlacesAPI = 'GooglePlacesSearch', GooglePlacesSearchQuery = {}, GoogleReverseGeocodingQuery = {}, filterReverseGeocodingByTypes = [], enableHighAccuracyLocation = true, listViewDisplayed: initialListViewDisplayed = 'auto', keepResultsAfterBlur = false, preProcess, onPress, onFail, onTimeout, } = props;
    const [text, setText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [listViewDisplayed, setListViewDisplayed] = useState(initialListViewDisplayed === 'auto' ? false : initialListViewDisplayed);
    const [url, setUrl] = useState(determineApiUrl(requestUrl));
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(uuidv4());
    const abortControllersRef = useRef([]);
    const resultsRef = useRef([]);
    useEffect(() => {
        setUrl(determineApiUrl(requestUrl));
    }, [requestUrl]);
    useEffect(() => {
        return () => {
            abortAllRequests(abortControllersRef.current);
        };
    }, []);
    useEffect(() => {
        const rows = buildRowsFromResults(resultsRef.current, predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasGeolocationSupport(), text);
        setDataSource(rows);
    }, [
        predefinedPlaces,
        predefinedPlacesAlwaysVisible,
        currentLocation,
        currentLocationLabel,
        text,
    ]);
    const abortRequests = useCallback(() => {
        abortAllRequests(abortControllersRef.current);
        abortControllersRef.current = [];
    }, []);
    const enableRowLoader = useCallback((rowData) => {
        setDataSource((prev) => prev.map((row) => row.place_id === rowData.place_id ? Object.assign(Object.assign({}, row), { isLoading: true }) : row));
    }, []);
    const disableRowLoaders = useCallback(() => {
        setDataSource((prev) => prev.map((row) => {
            if (row.isLoading) {
                const { isLoading: _isLoading } = row, rest = __rest(row, ["isLoading"]);
                return rest;
            }
            return row;
        }));
    }, []);
    const requestNearby = useCallback(async (latitude, longitude) => {
        abortRequests();
        if (latitude == null || longitude == null) {
            resultsRef.current = [];
            const rows = buildRowsFromResults([], predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasGeolocationSupport());
            setDataSource(rows);
            return;
        }
        const controller = createAbortController();
        abortControllersRef.current.push(controller);
        const headers = extractCustomHeaders(requestUrl);
        const requestConfig = nearbyPlacesAPI === 'GoogleReverseGeocoding'
            ? buildGeocodingRequest(url, latitude, longitude, Object.assign({ key: ('key' in query ? query.key : undefined) }, GoogleReverseGeocodingQuery), headers, timeout)
            : buildNearbySearchRequest(url, latitude, longitude, Object.assign({ key: ('key' in query ? query.key : undefined) }, GooglePlacesSearchQuery), headers, timeout);
        setLoading(true);
        const result = await makeGooglePlacesRequest(requestConfig, controller.signal);
        setLoading(false);
        disableRowLoaders();
        if (result.success) {
            const responseJSON = result.data;
            if (responseJSON.results) {
                let results = responseJSON.results;
                if (nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                    results = filterResultsByTypes(results, filterReverseGeocodingByTypes);
                }
                resultsRef.current = results;
                const rows = buildRowsFromResults(results, predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasGeolocationSupport());
                setDataSource(rows);
            }
            if (responseJSON.error_message) {
                if (onFail) {
                    onFail({
                        type: 'api_response',
                        message: responseJSON.error_message,
                        status: 'error',
                    });
                }
                else {
                    console.warn('Google Places API error:', responseJSON.error_message);
                }
            }
        }
        else if (result.error.type === 'timeout' && onTimeout) {
            onTimeout();
        }
        else if (onFail) {
            onFail(result.error);
        }
    }, [
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
    ]);
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
                    onPress(currentLocationPlace, null);
                }
            }
            else {
                await requestNearby(latitude, longitude);
            }
        }
        else {
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
    const request = useCallback(async (searchText) => {
        var _a;
        abortRequests();
        if (!url) {
            return;
        }
        if (!isPlatformSupported(!!requestUrl)) {
            return;
        }
        if (!searchText || searchText.length < minLength) {
            resultsRef.current = [];
            const rows = buildRowsFromResults([], predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasGeolocationSupport());
            setDataSource(rows);
            return;
        }
        const controller = createAbortController();
        abortControllersRef.current.push(controller);
        const headers = extractCustomHeaders(requestUrl);
        const requestConfig = isNewPlacesAPI
            ? buildAutocompleteNewRequest(url, searchText, query, sessionToken, headers, timeout)
            : buildAutocompleteLegacyRequest(url, searchText, query, headers, timeout);
        setLoading(true);
        const result = await makeGooglePlacesRequest(requestConfig, controller.signal);
        setLoading(false);
        if (result.success) {
            const responseJSON = result.data;
            if (responseJSON.predictions) {
                let results = responseJSON.predictions;
                if (nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                    results = filterResultsByTypes(results, filterReverseGeocodingByTypes);
                }
                resultsRef.current = results;
                const rows = buildRowsFromResults(results, predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasGeolocationSupport(), searchText);
                setDataSource(rows);
            }
            else if (responseJSON.suggestions) {
                const results = transformNewApiResults(responseJSON.suggestions);
                resultsRef.current = results;
                const rows = buildRowsFromResults(results, predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasGeolocationSupport(), searchText);
                setDataSource(rows);
            }
            if (responseJSON.error_message) {
                if (onFail) {
                    onFail({
                        type: 'api_response',
                        message: responseJSON.error_message,
                        status: (_a = responseJSON.status) !== null && _a !== void 0 ? _a : 'error',
                    });
                }
                else {
                    console.warn('Google Places API error:', responseJSON.error_message);
                }
            }
        }
        else if (result.error.type === 'timeout' && onTimeout) {
            onTimeout();
        }
        else if (onFail && result.error.type !== 'abort') {
            onFail(result.error);
        }
    }, [
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
    ]);
    const debouncedRequest = useMemo(() => debounce(request, debounceMs), [request, debounceMs]);
    const handleChangeText = useCallback((newText) => {
        const processedText = preProcess ? preProcess(newText) : newText;
        setText(processedText);
        debouncedRequest(processedText);
    }, [preProcess, debouncedRequest]);
    const fetchPlaceDetails = useCallback(async (placeId) => {
        const controller = createAbortController();
        abortControllersRef.current.push(controller);
        const headers = extractCustomHeaders(requestUrl);
        const detailsQuery = Object.assign({ key: ('key' in query ? query.key : undefined) }, GooglePlacesDetailsQuery);
        const requestConfig = isNewPlacesAPI
            ? buildPlaceDetailsNewRequest(url, placeId, detailsQuery, headers, timeout)
            : buildPlaceDetailsLegacyRequest(url, placeId, detailsQuery, headers, timeout);
        const result = await makeGooglePlacesRequest(requestConfig, controller.signal);
        if (result.success) {
            const details = 'result' in result.data ? result.data.result : result.data;
            if (isNewPlacesAPI) {
                setSessionToken(uuidv4());
            }
            return details;
        }
        else if (result.error.type === 'timeout' && onTimeout) {
            onTimeout();
        }
        else if (onFail) {
            onFail(result.error);
        }
        return null;
    }, [
        url,
        query,
        isNewPlacesAPI,
        GooglePlacesDetailsQuery,
        requestUrl,
        timeout,
        onFail,
        onTimeout,
    ]);
    const handleBlur = useCallback((e) => {
        if (e === null || e === void 0 ? void 0 : e.relatedTarget) {
            let node = e.relatedTarget.parentNode;
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
    }, [keepResultsAfterBlur]);
    const handlePress = useCallback(async (rowData) => {
        if (rowData.isCurrentLocation) {
            enableRowLoader(rowData);
            await handleGetCurrentLocation();
            return;
        }
        if (rowData.isPredefinedPlace && !fetchDetails) {
            const place = getPredefinedPlace(rowData, predefinedPlaces);
            const description = 'description' in place
                ? place.description
                : getDescriptionFromPlace(place);
            setText(description);
            if (onPress) {
                onPress(place, null);
            }
            handleBlur();
            return;
        }
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
        }
        else if (!fetchDetails) {
            setText(getDescriptionFromPlace(rowData));
            if (onPress) {
                onPress(rowData, null);
            }
            handleBlur();
        }
    }, [
        fetchDetails,
        enableRowLoader,
        handleGetCurrentLocation,
        predefinedPlaces,
        onPress,
        handleBlur,
        abortRequests,
        fetchPlaceDetails,
        disableRowLoaders,
    ]);
    const handleFocus = useCallback(() => {
        setListViewDisplayed(true);
    }, []);
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
//# sourceMappingURL=useGooglePlacesAutocomplete.js.map