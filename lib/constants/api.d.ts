export declare const GOOGLE_PLACES_API_BASE_URL: "https://maps.googleapis.com/maps/api";
export declare const GOOGLE_PLACES_ENDPOINTS: {
    readonly autocomplete: {
        readonly legacy: "/place/autocomplete/json";
        readonly new: "/v1/places:autocomplete";
    };
    readonly details: {
        readonly legacy: "/place/details/json";
        readonly new: "/v1/places";
    };
    readonly nearby: "/place/nearbysearch/json";
    readonly geocoding: "/geocode/json";
};
export declare const GOOGLE_PLACES_DEFAULT_QUERY_PARAMS: {
    readonly language: "en";
};
//# sourceMappingURL=api.d.ts.map