var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import { ResultsList } from './ResultsList';
import { isPlatformSupported } from '../utils/validators';
import { GOOGLE_PLACES_DEFAULT_STYLES } from '../constants/styles';
import { GOOGLE_PLACES_DEFAULT_MIN_LENGTH, GOOGLE_PLACES_DEFAULT_NUMBER_OF_LINES, GOOGLE_PLACES_DEFAULT_KEYBOARD_PERSIST, } from '../constants/defaults';
const defaultStyles = StyleSheet.create(GOOGLE_PLACES_DEFAULT_STYLES);
export const GooglePlacesAutocomplete = forwardRef((props, ref) => {
    const { placeholder = '', textInputHide = false, textInputProps = {}, styles = {}, suppressDefaultStyles = false, renderLeftButton, renderRightButton, inbetweenCompo, children, predefinedPlaces = [], currentLocation = false, disableScroll = false, enablePoweredByContainer = true, isRowScrollable = true, keyboardShouldPersistTaps = GOOGLE_PLACES_DEFAULT_KEYBOARD_PERSIST, listHoverColor = '#ececec', listUnderlayColor = '#c8c7cc', numberOfLines = GOOGLE_PLACES_DEFAULT_NUMBER_OF_LINES, minLength = GOOGLE_PLACES_DEFAULT_MIN_LENGTH, renderRow, renderDescription, renderHeaderComponent, listEmptyComponent, listLoaderComponent, requestUrl, } = props;
    const { text, dataSource, listViewDisplayed, loading, handleChangeText, handlePress, handleBlur, handleFocus, setText, getText, } = useGooglePlacesAutocomplete(props);
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => ({
        setAddressText: (address) => {
            setText(address);
        },
        getAddressText: () => getText(),
        blur: () => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur(); },
        focus: () => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); },
        isFocused: () => { var _a, _b; return (_b = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.isFocused()) !== null && _b !== void 0 ? _b : false; },
        clear: () => {
            var _a;
            setText('');
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.clear();
        },
        getCurrentLocation: () => {
        },
    }), [setText, getText]);
    const renderLeft = () => {
        if (renderLeftButton) {
            return renderLeftButton();
        }
        return null;
    };
    const renderRight = () => {
        if (renderRightButton) {
            return renderRightButton();
        }
        return null;
    };
    const handleTextInputChange = (newText) => {
        handleChangeText(newText);
        if (textInputProps.onChangeText) {
            textInputProps.onChangeText(newText);
        }
    };
    const handleTextInputFocus = (e) => {
        handleFocus();
        if (textInputProps.onFocus) {
            textInputProps.onFocus(e);
        }
    };
    const handleTextInputBlur = (e) => {
        handleBlur();
        if (textInputProps.onBlur) {
            textInputProps.onBlur(e);
        }
    };
    const onRowPress = (rowData) => {
        Keyboard.dismiss();
        handlePress(rowData);
    };
    const shouldShowList = isPlatformSupported(!!requestUrl) &&
        (text !== '' || predefinedPlaces.length > 0 || currentLocation) &&
        listViewDisplayed === true;
    const { onFocus: _userOnFocus, onBlur: _userOnBlur, onChangeText: _userOnChangeText, clearButtonMode } = textInputProps, userProps = __rest(textInputProps, ["onFocus", "onBlur", "onChangeText", "clearButtonMode"]);
    const TextInputComp = ('InputComp' in textInputProps && textInputProps.InputComp
        ? textInputProps.InputComp
        : TextInput);
    return (<View style={[
            suppressDefaultStyles ? {} : defaultStyles.container,
            styles.container,
        ]} pointerEvents='box-none'>
      {!textInputHide && (<View style={[
                suppressDefaultStyles ? {} : defaultStyles.textInputContainer,
                styles.textInputContainer,
            ]}>
          {renderLeft()}
          <TextInputComp ref={inputRef} style={[
                suppressDefaultStyles ? {} : defaultStyles.textInput,
                styles.textInput,
            ]} value={text} placeholder={placeholder} onFocus={handleTextInputFocus} onBlur={handleTextInputBlur} clearButtonMode={clearButtonMode || 'while-editing'} onChangeText={handleTextInputChange} {...userProps}/>
          {renderRight()}
        </View>)}
      {inbetweenCompo}
      {shouldShowList && (<ResultsList data={dataSource} onRowPress={onRowPress} onBlur={handleBlur} loading={loading} text={text} minLength={minLength} disableScroll={disableScroll} listViewStyle={styles.listView} separatorStyle={styles.separator} rowStyle={styles.row} loaderStyle={styles.loader} descriptionStyle={styles.description} predefinedPlacesDescriptionStyle={styles.predefinedPlacesDescription} poweredContainerStyle={styles.poweredContainer} poweredImageStyle={styles.powered} renderRow={renderRow} renderDescription={renderDescription} renderHeaderComponent={renderHeaderComponent} listEmptyComponent={listEmptyComponent} listLoaderComponent={listLoaderComponent} isRowScrollable={isRowScrollable} keyboardShouldPersistTaps={keyboardShouldPersistTaps} listHoverColor={listHoverColor} listUnderlayColor={listUnderlayColor} numberOfLines={numberOfLines} enablePoweredByContainer={enablePoweredByContainer} suppressDefaultStyles={suppressDefaultStyles}/>)}
      {children}
    </View>);
});
GooglePlacesAutocomplete.displayName = 'GooglePlacesAutocomplete';
//# sourceMappingURL=GooglePlacesAutocomplete.js.map