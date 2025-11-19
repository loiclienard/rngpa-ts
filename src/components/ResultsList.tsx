import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import type {
  StyleProp,
  ViewStyle,
  TextStyle,
  ListRenderItem,
} from 'react-native';
import type { GooglePlacesRowData } from '../types';
import { ResultRow } from './ResultRow';
import { PoweredByGoogle } from './PoweredByGoogle';

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
  readonly renderRow?: (
    data: GooglePlacesRowData,
    index: number,
  ) => React.ReactNode;
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

const defaultStyles = StyleSheet.create({
  listView: {},
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
});

function shouldShowPoweredLogo(
  data: ReadonlyArray<GooglePlacesRowData>,
  enablePoweredByContainer: boolean,
): boolean {
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

export function ResultsList({
  data,
  onRowPress,
  onBlur,
  loading,
  text,
  minLength,
  disableScroll = false,
  listViewStyle,
  separatorStyle,
  rowStyle,
  loaderStyle,
  descriptionStyle,
  predefinedPlacesDescriptionStyle,
  poweredContainerStyle,
  poweredImageStyle,
  renderRow,
  renderDescription,
  renderHeaderComponent,
  listEmptyComponent,
  listLoaderComponent,
  isRowScrollable = true,
  keyboardShouldPersistTaps = 'always',
  listHoverColor = '#ececec',
  listUnderlayColor = '#c8c7cc',
  numberOfLines = 1,
  enablePoweredByContainer = true,
  suppressDefaultStyles = false,
}: ResultsListProps): JSX.Element {
  const keyGenerator = () => Math.random().toString(36).substr(2, 10);

  const renderSeparator = () => {
    return (
      <View
        style={[
          suppressDefaultStyles ? {} : defaultStyles.separator,
          separatorStyle,
        ]}
      />
    );
  };

  const renderItem: ListRenderItem<GooglePlacesRowData> = ({ item, index }) => {
    return (
      <ResultRow
        rowData={item}
        index={index}
        onPress={onRowPress}
        onBlur={onBlur}
        renderRow={renderRow}
        renderDescription={renderDescription}
        isRowScrollable={isRowScrollable}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        listHoverColor={listHoverColor}
        listUnderlayColor={listUnderlayColor}
        numberOfLines={numberOfLines}
        rowStyle={rowStyle}
        loaderStyle={loaderStyle}
        descriptionStyle={descriptionStyle}
        predefinedPlacesDescriptionStyle={predefinedPlacesDescriptionStyle}
        suppressDefaultStyles={suppressDefaultStyles}
      />
    );
  };

  const renderFooter = () => {
    return (
      <PoweredByGoogle
        visible={shouldShowPoweredLogo(data, enablePoweredByContainer)}
        poweredContainerStyle={poweredContainerStyle}
        poweredImageStyle={poweredImageStyle}
        suppressDefaultStyles={suppressDefaultStyles}
      />
    );
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

  return (
    <FlatList
      nativeID='result-list-id'
      scrollEnabled={!disableScroll}
      style={[
        suppressDefaultStyles ? {} : defaultStyles.listView,
        listViewStyle,
      ]}
      data={data}
      keyExtractor={keyGenerator}
      ItemSeparatorComponent={renderSeparator}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={renderHeaderComponent ? renderHeaderComponent : null}
      ListFooterComponent={renderFooter}
    />
  );
}
