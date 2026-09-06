import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeatherLocation } from '../../services/weather/types';
import { weatherRepository } from '../../services/weather/weatherRepository';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useLocation } from '../../state/locationStore';
import { useSettings } from '../../state/settingsStore';

interface SearchLocationScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const SearchLocationScreen: React.FC<SearchLocationScreenProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { addLocation } = useLocation();
  const { accentColor } = useSettings();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherLocation[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const list = await weatherRepository.searchLocations(text);
      setResults(list);
    } catch (e) {
      console.warn('Search failed:', e);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (loc: WeatherLocation) => {
    addLocation(loc);
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 10,
            paddingLeft: insets.left + horizontalScale(16),
            paddingRight: insets.right + horizontalScale(16),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>find a location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Metro Flat Search Input Box */}
        <View style={[styles.inputBox, { borderColor: accentColor }]}>
          <TextInput
            style={styles.input}
            placeholder="city, state, or country"
            placeholderTextColor={colors.textDim}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            autoCapitalize="none"
          />
          {searching && <ActivityIndicator color={accentColor} style={{ marginRight: 8 }} />}
        </View>

        {/* Results List */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectLocation(item)}
              style={styles.resultItem}
            >
              <Text style={styles.cityName}>{item.cityName}</Text>
              <Text style={styles.regionName}>
                {[item.region, item.country].filter(Boolean).join(', ')}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length >= 2 && !searching ? (
              <Text style={styles.noResultsText}>no locations found</Text>
            ) : null
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(25, 22, 20, 0.97)',
    paddingHorizontal: horizontalScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(36),
    fontWeight: '200',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    textTransform: 'lowercase',
  },
  closeBtn: {
    padding: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    color: colors.textPrimary,
  },
  resultsList: {
    paddingVertical: 8,
  },
  resultItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerSubtle,
  },
  cityName: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(20),
    color: colors.textPrimary,
  },
  regionName: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(13),
    color: colors.textDim,
    marginTop: 2,
  },
  noResultsText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(18),
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 32,
    textTransform: 'lowercase',
  },
});
