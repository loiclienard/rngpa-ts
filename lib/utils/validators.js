import { Platform } from 'react-native';
export function isPlatformWeb() {
    return Platform.OS === 'web';
}
export function hasGeolocationSupport() {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
        return true;
    }
    if (!hasGeolocationSupport()) {
        console.warn('If you are using React Native v0.60.0+ you must follow these instructions to enable currentLocation: https://git.io/Jf4AR');
    }
    return false;
}
export function isPlatformSupported(hasCustomRequestUrl) {
    if (isPlatformWeb() && !hasCustomRequestUrl) {
        console.warn('This library cannot be used for the web unless you specify the requestUrl prop. See https://git.io/JflFv for more details.');
        return false;
    }
    return true;
}
//# sourceMappingURL=validators.js.map