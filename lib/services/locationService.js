import { Platform } from 'react-native';
import { GOOGLE_PLACES_GEOLOCATION_OPTIONS } from '../constants/defaults';
export function getCurrentLocation(enableHighAccuracy) {
    return new Promise((resolve) => {
        var _a;
        if (!(navigator === null || navigator === void 0 ? void 0 : navigator.geolocation)) {
            resolve({
                success: false,
                error: {
                    type: 'network',
                    message: 'Geolocation is not supported by this device',
                    originalError: new Error('Geolocation not available'),
                },
            });
            return;
        }
        const options = getGeolocationOptions(enableHighAccuracy);
        const geolocationWithDefault = navigator.geolocation;
        const getCurrentPosition = navigator.geolocation.getCurrentPosition ||
            ((_a = geolocationWithDefault.default) === null || _a === void 0 ? void 0 : _a.getCurrentPosition);
        if (!getCurrentPosition) {
            resolve({
                success: false,
                error: {
                    type: 'network',
                    message: 'getCurrentPosition method not available',
                    originalError: new Error('getCurrentPosition not available'),
                },
            });
            return;
        }
        getCurrentPosition((position) => {
            resolve({
                success: true,
                data: position,
            });
        }, (error) => {
            resolve({
                success: false,
                error: {
                    type: 'network',
                    message: error.message,
                    originalError: new Error(error.message),
                },
            });
        }, options);
    });
}
function getGeolocationOptions(enableHighAccuracy) {
    const platform = Platform.OS;
    if (enableHighAccuracy && platform === 'android') {
        return GOOGLE_PLACES_GEOLOCATION_OPTIONS.android;
    }
    if (platform === 'web') {
        return GOOGLE_PLACES_GEOLOCATION_OPTIONS.web;
    }
    return GOOGLE_PLACES_GEOLOCATION_OPTIONS.ios;
}
//# sourceMappingURL=locationService.js.map