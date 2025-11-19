import type { GooglePlacesAutocompleteProps, GooglePlacesRowData } from '../types';
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
export declare function useGooglePlacesAutocomplete(props: GooglePlacesAutocompleteProps): UseGooglePlacesAutocompleteReturn;
//# sourceMappingURL=useGooglePlacesAutocomplete.d.ts.map