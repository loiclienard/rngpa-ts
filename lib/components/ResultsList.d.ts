import React from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { GooglePlacesRowData } from '../types';
interface ResultsListProps {
    readonly data: ReadonlyArray<GooglePlacesRowData>;
    readonly onRowPress: (rowData: GooglePlacesRowData) => void;
    readonly onBlur: () => void;
    readonly loading: boolean;
    readonly text: string;
    readonly minLength: number;
    readonly disableScroll?: boolean;
    readonly listViewStyle?: StyleProp<ViewStyle>;
    readonly separatorStyle?: StyleProp<ViewStyle>;
    readonly rowStyle?: StyleProp<ViewStyle>;
    readonly loaderStyle?: StyleProp<ViewStyle>;
    readonly descriptionStyle?: StyleProp<TextStyle>;
    readonly predefinedPlacesDescriptionStyle?: StyleProp<TextStyle>;
    readonly poweredContainerStyle?: StyleProp<ViewStyle>;
    readonly poweredImageStyle?: StyleProp<ViewStyle>;
    readonly renderRow?: (data: GooglePlacesRowData, index: number) => React.ReactNode;
    readonly renderDescription?: (description: GooglePlacesRowData) => string;
    readonly renderHeaderComponent?: () => React.ReactNode;
    readonly listEmptyComponent?: React.ReactNode;
    readonly listLoaderComponent?: React.ReactNode;
    readonly isRowScrollable?: boolean;
    readonly keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
    readonly listHoverColor?: string;
    readonly listUnderlayColor?: string;
    readonly numberOfLines?: number;
    readonly enablePoweredByContainer?: boolean;
    readonly suppressDefaultStyles?: boolean;
}
export declare function ResultsList({ data, onRowPress, onBlur, loading, text, minLength, disableScroll, listViewStyle, separatorStyle, rowStyle, loaderStyle, descriptionStyle, predefinedPlacesDescriptionStyle, poweredContainerStyle, poweredImageStyle, renderRow, renderDescription, renderHeaderComponent, listEmptyComponent, listLoaderComponent, isRowScrollable, keyboardShouldPersistTaps, listHoverColor, listUnderlayColor, numberOfLines, enablePoweredByContainer, suppressDefaultStyles, }: ResultsListProps): JSX.Element;
export {};
//# sourceMappingURL=ResultsList.d.ts.map