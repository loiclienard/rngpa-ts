import { StyleSheet } from 'react-native';
import type { GooglePlacesAutocompleteStyles } from '../types';

export const GOOGLE_PLACES_DEFAULT_STYLES: GooglePlacesAutocompleteStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {
    flexDirection: 'row' as const,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
    marginBottom: 5,
  },
  listView: {},
  row: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    minHeight: 44,
    flexDirection: 'row' as const,
  },
  loader: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    height: 20,
  },
  description: {},
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  poweredContainer: {
    justifyContent: 'flex-end' as const,
    alignItems: 'center' as const,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: '#c8c7cc',
    borderTopWidth: 0.5,
  },
  powered: {},
  predefinedPlacesDescription: {},
} as const;
