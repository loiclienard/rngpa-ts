import type { GooglePlacesApiError, GooglePlacesRequestConfig, Result } from '../types';
export declare function makeGooglePlacesRequest<T>(config: GooglePlacesRequestConfig, signal?: AbortSignal): Promise<Result<T, GooglePlacesApiError>>;
export declare function requestShouldUseCredentials(url: string): boolean;
export declare function extractRequestHeaders(requestUrlHeaders: Readonly<Record<string, string>> | undefined): Readonly<Record<string, string>>;
export declare function createAbortController(): AbortController;
export declare function abortAllRequests(controllers: AbortController[]): void;
//# sourceMappingURL=apiService.d.ts.map