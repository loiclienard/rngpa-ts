import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ResultRow } from './ResultRow';
import { PoweredByGoogle } from './PoweredByGoogle';
const defaultStyles = StyleSheet.create({
    listView: {},
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
});
function shouldShowPoweredLogo(data, enablePoweredByContainer) {
    if (!enablePoweredByContainer || data.length === 0) {
        return false;
    }
    for (const row of data) {
        if (!row.isCurrentLocation && !row.isPredefinedPlace) {
            return true;
        }
    }
    return false;
}
export function ResultsList({ data, onRowPress, onBlur, loading, text, minLength, disableScroll = false, listViewStyle, separatorStyle, rowStyle, loaderStyle, descriptionStyle, predefinedPlacesDescriptionStyle, poweredContainerStyle, poweredImageStyle, renderRow, renderDescription, renderHeaderComponent, listEmptyComponent, listLoaderComponent, isRowScrollable = true, keyboardShouldPersistTaps = 'always', listHoverColor = '#ececec', listUnderlayColor = '#c8c7cc', numberOfLines = 1, enablePoweredByContainer = true, suppressDefaultStyles = false, }) {
    const keyGenerator = () => Math.random().toString(36).substr(2, 10);
    const renderSeparator = () => {
        return (<View style={[
                suppressDefaultStyles ? {} : defaultStyles.separator,
                separatorStyle,
            ]}/>);
    };
    const renderItem = ({ item, index }) => {
        return (<ResultRow rowData={item} index={index} onPress={onRowPress} onBlur={onBlur} renderRow={renderRow} renderDescription={renderDescription} isRowScrollable={isRowScrollable} keyboardShouldPersistTaps={keyboardShouldPersistTaps} listHoverColor={listHoverColor} listUnderlayColor={listUnderlayColor} numberOfLines={numberOfLines} rowStyle={rowStyle} loaderStyle={loaderStyle} descriptionStyle={descriptionStyle} predefinedPlacesDescriptionStyle={predefinedPlacesDescriptionStyle} suppressDefaultStyles={suppressDefaultStyles}/>);
    };
    const renderFooter = () => {
        return (<PoweredByGoogle visible={shouldShowPoweredLogo(data, enablePoweredByContainer)} poweredContainerStyle={poweredContainerStyle} poweredImageStyle={poweredImageStyle} suppressDefaultStyles={suppressDefaultStyles}/>);
    };
    const renderEmptyComponent = () => {
        if (loading && listLoaderComponent) {
            return typeof listLoaderComponent === 'function'
                ? React.createElement(listLoaderComponent)
                : listLoaderComponent;
        }
        if (text.length > minLength && listEmptyComponent) {
            return typeof listEmptyComponent === 'function'
                ? React.createElement(listEmptyComponent)
                : listEmptyComponent;
        }
        return null;
    };
    return (<FlatList nativeID='result-list-id' scrollEnabled={!disableScroll} style={[
            suppressDefaultStyles ? {} : defaultStyles.listView,
            listViewStyle,
        ]} data={data} keyExtractor={keyGenerator} ItemSeparatorComponent={renderSeparator} renderItem={renderItem} ListEmptyComponent={renderEmptyComponent} ListHeaderComponent={renderHeaderComponent ? renderHeaderComponent : null} ListFooterComponent={renderFooter}/>);
}
//# sourceMappingURL=ResultsList.js.map