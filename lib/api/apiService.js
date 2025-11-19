import { GOOGLE_PLACES_API_BASE_URL } from '../constants/api';
export async function makeGooglePlacesRequest(config, signal) {
    const { url, method, headers, body, timeout } = config;
    try {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timeout'));
            }, timeout);
        });
        const fetchPromise = fetch(url, {
            method,
            headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
            body,
            signal,
            credentials: url.includes(GOOGLE_PLACES_API_BASE_URL)
                ? 'same-origin'
                : 'omit',
        });
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        if (!response.ok) {
            const errorBody = await response.text().catch(() => 'Unknown error');
            return {
                success: false,
                error: {
                    type: 'api_response',
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    status: String(response.status),
                    responseBody: errorBody,
                },
            };
        }
        const data = await response.json();
        return {
            success: true,
            data,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return {
                success: false,
                error: {
                    type: 'abort',
                    message: 'Request was aborted',
                },
            };
        }
        if (error instanceof Error && error.message === 'Request timeout') {
            return {
                success: false,
                error: {
                    type: 'timeout',
                    message: `Request timed out after ${timeout}ms`,
                    timeoutMs: timeout,
                },
            };
        }
        return {
            success: false,
            error: {
                type: 'network',
                message: error instanceof Error ? error.message : 'Network request failed',
                originalError: error instanceof Error ? error : new Error(String(error)),
            },
        };
    }
}
export function requestShouldUseCredentials(url) {
    return url === GOOGLE_PLACES_API_BASE_URL;
}
export function extractRequestHeaders(requestUrlHeaders) {
    return requestUrlHeaders !== null && requestUrlHeaders !== void 0 ? requestUrlHeaders : {};
}
export function createAbortController() {
    return new AbortController();
}
export function abortAllRequests(controllers) {
    controllers.forEach((controller) => {
        try {
            controller.abort();
        }
        catch (error) {
            console.warn('Error aborting request:', error);
        }
    });
}
//# sourceMappingURL=apiService.js.map