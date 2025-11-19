import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import type { TextInputProps } from 'react-native';
import type {
  GooglePlacesAutocompleteProps,
  GooglePlacesAutocompleteRef,
  GooglePlacesRowData,
} from '../types';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import { ResultsList } from './ResultsList';
import { isPlatformSupported } from '../utils/validators';
import { GOOGLE_PLACES_DEFAULT_STYLES } from '../constants/styles';
import {
  GOOGLE_PLACES_DEFAULT_MIN_LENGTH,
  GOOGLE_PLACES_DEFAULT_NUMBER_OF_LINES,
  GOOGLE_PLACES_DEFAULT_KEYBOARD_PERSIST,
} from '../constants/defaults';

// @ts-expect-error - Style types are compatible but TypeScript can't infer the exact structure
const defaultStyles = StyleSheet.create(GOOGLE_PLACES_DEFAULT_STYLES);

export const GooglePlacesAutocomplete = forwardRef<
  GooglePlacesAutocompleteRef,
  GooglePlacesAutocompleteProps
>((props, ref) => {
  const {
    placeholder = '',
    textInputHide = false,
    textInputProps = {},
    styles = {},
    suppressDefaultStyles = false,
    renderLeftButton,
    renderRightButton,
    inbetweenCompo,
    children,
    predefinedPlaces = [],
    currentLocation = false,
    disableScroll = false,
    enablePoweredByContainer = true,
    isRowScrollable = true,
    keyboardShouldPersistTaps = GOOGLE_PLACES_DEFAULT_KEYBOARD_PERSIST,
    listHoverColor = '#ececec',
    listUnderlayColor = '#c8c7cc',
    numberOfLines = GOOGLE_PLACES_DEFAULT_NUMBER_OF_LINES,
    minLength = GOOGLE_PLACES_DEFAULT_MIN_LENGTH,
    renderRow,
    renderDescription,
    renderHeaderComponent,
    listEmptyComponent,
    listLoaderComponent,
    requestUrl,
  } = props;

  // Use the hook for business logic
  const {
    text,
    dataSource,
    listViewDisplayed,
    loading,
    handleChangeText,
    handlePress,
    handleBlur,
    handleFocus,
    setText,
    getText,
  } = useGooglePlacesAutocomplete(props);

  const inputRef = useRef<TextInput>(null);

  // Expose imperative methods via ref
  useImperativeHandle(
    ref,
    () =>
      ({
        setAddressText: (address: string) => {
          setText(address);
        },
        getAddressText: () => getText(),
        blur: () => inputRef.current?.blur(),
        focus: () => inputRef.current?.focus(),
        isFocused: () => inputRef.current?.isFocused() ?? false,
        clear: () => {
          setText('');
          inputRef.current?.clear();
        },
        getCurrentLocation: () => {
          // This would trigger the current location flow
          // For now, we'll handle this through the onPress of current location row
        },
      }) as GooglePlacesAutocompleteRef,
    [setText, getText],
  );

  // Render left button
  const renderLeft = () => {
    if (renderLeftButton) {
      return renderLeftButton();
    }
    return null;
  };

  // Render right button
  const renderRight = () => {
    if (renderRightButton) {
      return renderRightButton();
    }
    return null;
  };

  // Handle text input change with custom handler
  const handleTextInputChange = (newText: string) => {
    handleChangeText(newText);

    // Call custom onChangeText if provided
    if (textInputProps.onChangeText) {
      textInputProps.onChangeText(newText);
    }
  };

  // Handle focus with custom handler
  const handleTextInputFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    handleFocus();

    if (textInputProps.onFocus) {
      textInputProps.onFocus(e);
    }
  };

  // Handle blur with custom handler
  const handleTextInputBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    handleBlur();

    if (textInputProps.onBlur) {
      textInputProps.onBlur(e);
    }
  };

  // Handle row press with keyboard dismissal
  const onRowPress = (rowData: GooglePlacesRowData) => {
    Keyboard.dismiss();
    handlePress(rowData);
  };

  // Determine if list should be shown
  const shouldShowList =
    isPlatformSupported(!!requestUrl) &&
    (text !== '' || predefinedPlaces.length > 0 || currentLocation) &&
    listViewDisplayed === true;

  // Extract TextInput props
  const {
    onFocus: _userOnFocus,
    onBlur: _userOnBlur,
    onChangeText: _userOnChangeText,
    clearButtonMode,
    ...userProps
  } = textInputProps;

  const TextInputComp: typeof TextInput = (
    'InputComp' in textInputProps && textInputProps.InputComp
      ? textInputProps.InputComp
      : TextInput
  ) as typeof TextInput;

  return (
    <View
      style={[
        suppressDefaultStyles ? {} : defaultStyles.container,
        styles.container,
      ]}
      pointerEvents='box-none'
    >
      {!textInputHide && (
        <View
          style={[
            suppressDefaultStyles ? {} : defaultStyles.textInputContainer,
            styles.textInputContainer,
          ]}
        >
          {renderLeft()}
          <TextInputComp
            ref={inputRef}
            style={[
              suppressDefaultStyles ? {} : defaultStyles.textInput,
              styles.textInput,
            ]}
            value={text}
            placeholder={placeholder}
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            clearButtonMode={clearButtonMode || 'while-editing'}
            onChangeText={handleTextInputChange}
            {...userProps}
          />
          {renderRight()}
        </View>
      )}
      {inbetweenCompo}
      {shouldShowList && (
        <ResultsList
          data={dataSource}
          onRowPress={onRowPress}
          onBlur={handleBlur}
          loading={loading}
          text={text}
          minLength={minLength}
          disableScroll={disableScroll}
          listViewStyle={styles.listView}
          separatorStyle={styles.separator}
          rowStyle={styles.row}
          loaderStyle={styles.loader}
          descriptionStyle={styles.description}
          predefinedPlacesDescriptionStyle={styles.predefinedPlacesDescription}
          poweredContainerStyle={styles.poweredContainer}
          poweredImageStyle={styles.powered}
          renderRow={renderRow}
          renderDescription={renderDescription}
          renderHeaderComponent={renderHeaderComponent}
          listEmptyComponent={listEmptyComponent}
          listLoaderComponent={listLoaderComponent}
          isRowScrollable={isRowScrollable}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          listHoverColor={listHoverColor}
          listUnderlayColor={listUnderlayColor}
          numberOfLines={numberOfLines}
          enablePoweredByContainer={enablePoweredByContainer}
          suppressDefaultStyles={suppressDefaultStyles}
        />
      )}
      {children}
    </View>
  );
});

GooglePlacesAutocomplete.displayName = 'GooglePlacesAutocomplete';
