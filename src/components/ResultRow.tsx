import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { GooglePlacesRowData } from '../types';

interface ResultRowProps {
  readonly rowData: GooglePlacesRowData;
  readonly index: number;
  readonly onPress: (rowData: GooglePlacesRowData) => void;
  readonly onBlur: () => void;
  readonly renderRow?: (
    data: GooglePlacesRowData,
    index: number,
  ) => React.ReactNode;
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

function getDescriptionText(
  rowData: GooglePlacesRowData,
  renderDescription?: (description: GooglePlacesRowData) => string,
): string {
  if (renderDescription) {
    return renderDescription(rowData);
  }
  return rowData.description;
}

export function ResultRow({
  rowData,
  index,
  onPress,
  onBlur,
  renderRow,
  renderDescription,
  isRowScrollable = true,
  keyboardShouldPersistTaps = 'always',
  listHoverColor = '#ececec',
  listUnderlayColor = '#c8c7cc',
  numberOfLines = 1,
  rowStyle,
  loaderStyle,
  descriptionStyle,
  predefinedPlacesDescriptionStyle,
  suppressDefaultStyles = false,
}: ResultRowProps): JSX.Element {
  const renderLoader = () => {
    if (rowData.isLoading) {
      return (
        <View
          style={[
            suppressDefaultStyles ? {} : defaultStyles.loader,
            loaderStyle,
          ]}
        >
          <ActivityIndicator animating={true} size='small' />
        </View>
      );
    }
    return null;
  };

  const renderRowData = () => {
    if (renderRow) {
      return renderRow(rowData, index);
    }

    return (
      <Text
        style={[
          suppressDefaultStyles ? {} : defaultStyles.description,
          descriptionStyle,
          rowData.isPredefinedPlace ? predefinedPlacesDescriptionStyle : {},
        ]}
        numberOfLines={numberOfLines}
      >
        {getDescriptionText(rowData, renderDescription)}
      </Text>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={
        isRowScrollable
          ? defaultStyles.scrollableContent
          : defaultStyles.fixedContent
      }
      scrollEnabled={isRowScrollable}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        style={({ pressed }) => [
          isRowScrollable
            ? defaultStyles.scrollableContent
            : defaultStyles.fixedContent,
          {
            backgroundColor: pressed ? listUnderlayColor : listHoverColor,
          },
        ]}
        onPress={() => onPress(rowData)}
        onBlur={onBlur}
      >
        <View
          style={[suppressDefaultStyles ? {} : defaultStyles.row, rowStyle]}
        >
          {renderLoader()}
          {renderRowData()}
        </View>
      </Pressable>
    </ScrollView>
  );
}
