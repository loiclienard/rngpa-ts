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
import Qs from 'qs';
import { GOOGLE_PLACES_ENDPOINTS } from '../constants/api';
export function buildAutocompleteLegacyRequest(baseUrl, text, query, headers, timeout) {
    const queryString = Qs.stringify(Object.assign({ input: text }, query));
    return {
        url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.autocomplete.legacy}?${queryString}`,
        method: 'GET',
        headers,
        timeout,
    };
}
export function buildAutocompleteNewRequest(baseUrl, text, query, sessionToken, headers, timeout) {
    const keyQueryParam = 'key' in query && query.key ? '?' + Qs.stringify({ key: query.key }) : '';
    const _a = query, { key, locationbias, types } = _a, rest = __rest(_a, ["key", "locationbias", "types"]);
    return {
        url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.autocomplete.new}${keyQueryParam}`,
        method: 'POST',
        headers,
        body: JSON.stringify(Object.assign({ input: text, sessionToken }, rest)),
        timeout,
    };
}
export function buildPlaceDetailsLegacyRequest(baseUrl, placeId, query, headers, timeout) {
    const queryString = Qs.stringify(Object.assign({ place_id: placeId }, query));
    return {
        url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.details.legacy}?${queryString}`,
        method: 'GET',
        headers,
        timeout,
    };
}
export function buildPlaceDetailsNewRequest(baseUrl, placeId, query, headers, timeout) {
    const keyQueryParam = 'key' in query && query.key ? '?' + Qs.stringify({ key: query.key }) : '';
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
export function buildNearbySearchRequest(baseUrl, latitude, longitude, query, headers, timeout) {
    const queryString = Qs.stringify(Object.assign({ location: `${latitude},${longitude}` }, query));
    return {
        url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.nearby}?${queryString}`,
        method: 'GET',
        headers,
        timeout,
    };
}
export function buildGeocodingRequest(baseUrl, latitude, longitude, query, headers, timeout) {
    const queryString = Qs.stringify(Object.assign({ latlng: `${latitude},${longitude}` }, query));
    return {
        url: `${baseUrl}${GOOGLE_PLACES_ENDPOINTS.geocoding}?${queryString}`,
        method: 'GET',
        headers,
        timeout,
    };
}
export function shouldIncludeResult(resultTypes, filterTypes) {
    if (filterTypes.length === 0)
        return true;
    for (const filterType of filterTypes) {
        if (resultTypes.includes(filterType)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=endpoints.js.map