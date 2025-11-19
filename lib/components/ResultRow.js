import React from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet, } from 'react-native';
const defaultStyles = StyleSheet.create({
    row: {
        backgroundColor: '#FFFFFF',
        padding: 13,
        minHeight: 44,
        flexDirection: 'row',
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    description: {},
    scrollableContent: {
        minWidth: '100%',
    },
    fixedContent: {
        width: '100%',
    },
});
function getDescriptionText(rowData, renderDescription) {
    if (renderDescription) {
        return renderDescription(rowData);
    }
    return rowData.description;
}
export function ResultRow({ rowData, index, onPress, onBlur, renderRow, renderDescription, isRowScrollable = true, keyboardShouldPersistTaps = 'always', listHoverColor = '#ececec', listUnderlayColor = '#c8c7cc', numberOfLines = 1, rowStyle, loaderStyle, descriptionStyle, predefinedPlacesDescriptionStyle, suppressDefaultStyles = false, }) {
    const renderLoader = () => {
        if (rowData.isLoading) {
            return (<View style={[
                    suppressDefaultStyles ? {} : defaultStyles.loader,
                    loaderStyle,
                ]}>
          <ActivityIndicator animating={true} size='small'/>
        </View>);
        }
        return null;
    };
    const renderRowData = () => {
        if (renderRow) {
            return renderRow(rowData, index);
        }
        return (<Text style={[
                suppressDefaultStyles ? {} : defaultStyles.description,
                descriptionStyle,
                rowData.isPredefinedPlace ? predefinedPlacesDescriptionStyle : {},
            ]} numberOfLines={numberOfLines}>
        {getDescriptionText(rowData, renderDescription)}
      </Text>);
    };
    return (<ScrollView contentContainerStyle={isRowScrollable
            ? defaultStyles.scrollableContent
            : defaultStyles.fixedContent} scrollEnabled={isRowScrollable} keyboardShouldPersistTaps={keyboardShouldPersistTaps} horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <Pressable style={({ pressed }) => [
            isRowScrollable
                ? defaultStyles.scrollableContent
                : defaultStyles.fixedContent,
            {
                backgroundColor: pressed ? listUnderlayColor : listHoverColor,
            },
        ]} onPress={() => onPress(rowData)} onBlur={onBlur}>
        <View style={[suppressDefaultStyles ? {} : defaultStyles.row, rowStyle]}>
          {renderLoader()}
          {renderRowData()}
        </View>
      </Pressable>
    </ScrollView>);
}
//# sourceMappingURL=ResultRow.js.map