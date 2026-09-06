import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocation } from '../../state/locationStore';
import { useSettings } from '../../state/settingsStore';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { MetroButton } from '../../components/metro/MetroButton';

interface LocationsScreenProps {
  visible: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({
  visible,
  onClose,
  onOpenSearch,
}) => {
  const insets = useSafeAreaInsets();
  const { locations, activeLocation, setActiveLocation, removeLocation } = useLocation();
  const { accentColor } = useSettings();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>places</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Locations List */}
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isActive = item.id === activeLocation.id;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setActiveLocation(item);
                  onClose();
                }}
                style={[
                  styles.itemCard,
                  isActive && { borderLeftColor: accentColor, borderLeftWidth: 4 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cityName}>{item.cityName}</Text>
                  <Text style={styles.regionName}>
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>

                {locations.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeLocation(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.textDim} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          }}
        />

        {/* Add Location Button */}
        <View style={styles.footer}>
          <MetroButton
            title="add location"
            variant="accent"
            onPress={() => {
              onClose();
              onOpenSearch();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(25, 22, 20, 0.98)',
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
    fontSize: normalizeFont(38),
    fontWeight: '200',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    textTransform: 'lowercase',
  },
  closeBtn: {
    padding: 6,
  },
  listContent: {
    paddingVertical: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 6,
    borderRadius: 0,
  },
  cityName: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(22),
    color: colors.textPrimary,
  },
  regionName: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(13),
    color: colors.textDim,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  footer: {
    marginTop: 12,
  },
});
