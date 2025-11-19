import React from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { GooglePlacesRowData } from '../types';
interface ResultRowProps {
    readonly rowData: GooglePlacesRowData;
    readonly index: number;
    readonly onPress: (rowData: GooglePlacesRowData) => void;
    readonly onBlur: () => void;
    readonly renderRow?: (data: GooglePlacesRowData, index: number) => React.ReactNode;
    readonly renderDescription?: (description: GooglePlacesRowData) => string;
    readonly isRowScrollable?: boolean;
    readonly keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
    readonly listHoverColor?: string;
    readonly listUnderlayColor?: string;
    readonly numberOfLines?: number;
    readonly rowStyle?: StyleProp<ViewStyle>;
    readonly loaderStyle?: StyleProp<ViewStyle>;
    readonly descriptionStyle?: StyleProp<TextStyle>;
    readonly predefinedPlacesDescriptionStyle?: StyleProp<TextStyle>;
    readonly suppressDefaultStyles?: boolean;
}
export declare function ResultRow({ rowData, index, onPress, onBlur, renderRow, renderDescription, isRowScrollable, keyboardShouldPersistTaps, listHoverColor, listUnderlayColor, numberOfLines, rowStyle, loaderStyle, descriptionStyle, predefinedPlacesDescriptionStyle, suppressDefaultStyles, }: ResultRowProps): JSX.Element;
export {};
//# sourceMappingURL=ResultRow.d.ts.map