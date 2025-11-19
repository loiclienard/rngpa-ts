export function filterResultsByTypes(results, filterTypes) {
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
export function transformNewApiResults(suggestions) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const results = [];
    for (const suggestion of suggestions) {
        if (suggestion.placePrediction) {
            const pred = suggestion.placePrediction;
            results.push({
                description: (_b = (_a = pred.text) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '',
                place_id: (_c = pred.placeId) !== null && _c !== void 0 ? _c : '',
                reference: (_d = pred.placeId) !== null && _d !== void 0 ? _d : '',
                id: (_e = pred.placeId) !== null && _e !== void 0 ? _e : '',
                matched_substrings: [],
                structured_formatting: {
                    main_text: (_h = (_g = (_f = pred.structuredFormat) === null || _f === void 0 ? void 0 : _f.mainText) === null || _g === void 0 ? void 0 : _g.text) !== null && _h !== void 0 ? _h : '',
                    main_text_matched_substrings: [],
                    secondary_text: (_l = (_k = (_j = pred.structuredFormat) === null || _j === void 0 ? void 0 : _j.secondaryText) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : '',
                    secondary_text_matched_substrings: [],
                },
                terms: [],
                types: ((_m = pred.types) !== null && _m !== void 0 ? _m : []),
            });
        }
    }
    return results;
}
export function buildRowsFromResults(results, predefinedPlaces, predefinedPlacesAlwaysVisible, currentLocation, currentLocationLabel, hasNavigatorSupport, text) {
    const rows = [];
    const shouldDisplayPredefinedPlaces = text
        ? results.length === 0 && text.length === 0
        : results.length === 0;
    if (shouldDisplayPredefinedPlaces || predefinedPlacesAlwaysVisible) {
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
    for (const result of results) {
        rows.push(Object.assign({}, result));
    }
    return rows;
}
export function getDescriptionFromPlace(place) {
    var _a, _b;
    if ('description' in place) {
        return place.description;
    }
    if ('formatted_address' in place) {
        return (_a = place.formatted_address) !== null && _a !== void 0 ? _a : '';
    }
    if ('name' in place) {
        return (_b = place.name) !== null && _b !== void 0 ? _b : '';
    }
    return '';
}
export function getPredefinedPlace(rowData, predefinedPlaces) {
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
//# sourceMappingURL=dataTransformers.js.map