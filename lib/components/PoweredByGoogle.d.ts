import type { StyleProp, ViewStyle, ImageStyle } from 'react-native';
interface PoweredByGoogleProps {
    readonly visible: boolean;
    readonly poweredContainerStyle?: StyleProp<ViewStyle>;
    readonly poweredImageStyle?: StyleProp<ViewStyle | ImageStyle>;
    readonly suppressDefaultStyles?: boolean;
}
export declare function PoweredByGoogle({ visible, poweredContainerStyle, poweredImageStyle, suppressDefaultStyles, }: PoweredByGoogleProps): JSX.Element | null;
export {};
//# sourceMappingURL=PoweredByGoogle.d.ts.map