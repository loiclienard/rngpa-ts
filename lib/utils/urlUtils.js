import { Platform } from 'react-native';
import { GOOGLE_PLACES_API_BASE_URL } from '../constants/api';
export function determineApiUrl(requestUrl) {
    if (!requestUrl) {
        return GOOGLE_PLACES_API_BASE_URL;
    }
    if (requestUrl.useOnPlatform === 'all') {
        return requestUrl.url;
    }
    if (requestUrl.useOnPlatform === 'web') {
        return Platform.select({
            web: requestUrl.url,
            default: GOOGLE_PLACES_API_BASE_URL,
        });
    }
    return GOOGLE_PLACES_API_BASE_URL;
}
export function extractCustomHeaders(requestUrl) {
    var _a;
    return (_a = requestUrl === null || requestUrl === void 0 ? void 0 : requestUrl.headers) !== null && _a !== void 0 ? _a : {};
}
//# sourceMappingURL=urlUtils.js.map