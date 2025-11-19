import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
const defaultStyles = StyleSheet.create({
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#c8c7cc',
        borderTopWidth: 0.5,
    },
    powered: {},
});
export function PoweredByGoogle({ visible, poweredContainerStyle, poweredImageStyle, suppressDefaultStyles = false, }) {
    if (!visible) {
        return null;
    }
    return (<View style={[
            suppressDefaultStyles ? {} : defaultStyles.poweredContainer,
            poweredContainerStyle,
        ]}>
      <Image style={[
            suppressDefaultStyles ? {} : defaultStyles.powered,
            poweredImageStyle,
        ]} resizeMode='contain' source={require('../../images/powered_by_google_on_white.png')}/>
    </View>);
}
//# sourceMappingURL=PoweredByGoogle.js.map