import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  BackHandler,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../../state/settingsStore';
import { MetroToggle } from '../../components/metro/MetroToggle';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import {
  TemperatureUnit,
  WindUnit,
  PressureUnit,
  DistanceUnit,
} from '../../services/weather/types';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

// Authentic Windows Phone 8 theme accent colors (Live Tile square palette)
const ACCENT_OPTIONS = [
  { name: 'Cobalt', color: '#0050EF' },
  { name: 'Cyan', color: '#1BA1E2' },
  { name: 'Teal', color: '#00ABA9' },
  { name: 'Emerald', color: '#008A00' },
  { name: 'Green', color: '#60A917' },
  { name: 'Lime', color: '#A4C400' },
  { name: 'Amber', color: '#F0A30A' },
  { name: 'Orange', color: '#FA6800' },
  { name: 'Red', color: '#E51400' },
  { name: 'Crimson', color: '#A20025' },
  { name: 'Magenta', color: '#D80073' },
  { name: 'Purple', color: '#76608A' },
  { name: 'Indigo', color: '#6A00FF' },
  { name: 'Steel', color: '#647687' },
  { name: 'Taupe', color: '#87794E' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const {
    temperatureUnit,
    setTemperatureUnit,
    windUnit,
    setWindUnit,
    pressureUnit,
    setPressureUnit,
    distanceUnit,
    setDistanceUnit,
    accentColor,
    setAccentColor,
    showTopBar,
    setShowTopBar,
    useImageryBackground,
    setUseImageryBackground,
    forecastProvider,
    setForecastProvider,
    themeMode,
    setThemeMode,
  } = useSettings();

  // Hardware Back Press closes settings
  useEffect(() => {
    if (!visible) return;
    const onBackPress = () => {
      onClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [visible, onClose]);

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 20
  );
  const bottomInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 16 : 0
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          {
            paddingTop: topInset + 6,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        {/* Windows Phone Settings Header */}
        <View
          style={[
            styles.header,
            {
              paddingLeft: Math.max(insets.left, horizontalScale(18)),
              paddingRight: Math.max(insets.right, horizontalScale(18)),
            },
          ]}
        >
          <Text style={styles.appSuperTitle}>METRO WEATHER</Text>
          <Text style={styles.headerTitle}>settings</Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: 68 + bottomInset + 32,
              paddingLeft: Math.max(insets.left, horizontalScale(18)),
              paddingRight: Math.max(insets.right, horizontalScale(18)),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION: UNITS */}
          <Text style={styles.sectionHeader}>UNITS</Text>

          {/* Temperature */}
          <MetroListPicker<TemperatureUnit>
            label="temperature"
            value={temperatureUnit}
            options={[
              { value: 'F', label: 'Fahrenheit (°F)' },
              { value: 'C', label: 'Celsius (°C)' },
            ]}
            onSelect={(val) => setTemperatureUnit(val)}
            accentColor={accentColor}
          />

          {/* Wind Speed */}
          <MetroListPicker<WindUnit>
            label="wind speed"
            value={windUnit}
            options={[
              { value: 'mph', label: 'Miles per hour (mph)' },
              { value: 'kmh', label: 'Kilometres per hour (km/h)' },
            ]}
            onSelect={(val) => setWindUnit(val)}
            accentColor={accentColor}
          />

          {/* Barometer / Pressure */}
          <MetroListPicker<PressureUnit>
            label="barometer"
            value={pressureUnit}
            options={[
              { value: 'inHg', label: 'Inches of mercury (inHg)' },
              { value: 'hPa', label: 'Hectopascals (hPa)' },
            ]}
            onSelect={(val) => setPressureUnit(val)}
            accentColor={accentColor}
          />

          {/* Visibility / Distance */}
          <MetroListPicker<DistanceUnit>
            label="visibility"
            value={distanceUnit}
            options={[
              { value: 'mi', label: 'Miles (mi)' },
              { value: 'km', label: 'Kilometres (km)' },
            ]}
            onSelect={(val) => setDistanceUnit(val)}
            accentColor={accentColor}
          />

          {/* SECTION: THEME & APPEARANCE */}
          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>APPEARANCE</Text>

          {/* Theme Mode Picker */}
          <MetroListPicker<'auto' | 'day' | 'night'>
            label="theme palette"
            subLabel="Dynamic day/night or fixed Windows Phone palette"
            value={themeMode}
            options={[
              { value: 'auto', label: 'Auto (Day / Night)' },
              { value: 'day', label: 'Day (Royal Blue)' },
              { value: 'night', label: 'Night (Midnight Navy)' },
            ]}
            onSelect={(val) => setThemeMode(val)}
            accentColor={accentColor}
          />

          {/* Background Photos Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.settingLabel}>Weather photography</Text>
              <Text style={styles.settingSubLabel}>
                Display atmospheric backgrounds for current conditions
              </Text>
            </View>
            <MetroToggle
              value={useImageryBackground}
              onValueChange={(val) => setUseImageryBackground(val)}
            />
          </View>

          {/* Optional Top Bar Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.settingLabel}>Top accent bar</Text>
              <Text style={styles.settingSubLabel}>
                Show classic Windows Phone colored status header
              </Text>
            </View>
            <MetroToggle
              value={showTopBar}
              onValueChange={(val) => setShowTopBar(val)}
            />
          </View>

          {/* Accent Color: Authentic WP8 Square Tiles */}
          <View style={{ marginTop: 16 }}>
            <Text style={styles.settingLabel}>Accent color</Text>
            <Text style={styles.settingSubLabel}>
              Windows Phone 8 Live Tile color palette
            </Text>
            <View style={styles.colorTileGrid}>
              {ACCENT_OPTIONS.map((item) => {
                const isSelected = accentColor.toLowerCase() === item.color.toLowerCase();
                return (
                  <TouchableOpacity
                    key={item.color}
                    activeOpacity={0.8}
                    onPress={() => setAccentColor(item.color)}
                    style={[
                      styles.colorSquareTile,
                      { backgroundColor: item.color },
                      isSelected && styles.colorSquareTileSelected,
                    ]}
                    accessibilityLabel={`Accent color ${item.name}`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={22} color={colors.white} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* SECTION: FORECAST MODEL */}
          <Text style={[styles.sectionHeader, { marginTop: 32 }]}>FORECAST MODEL</Text>
          <Text style={styles.settingSubLabel}>
            Select the weather prediction model for your region (Americas, Europe, Asia, or worldwide)
          </Text>

          <View style={{ marginTop: 10, gap: 8 }}>
            {[
              { id: 'auto', label: 'Auto (Seamless Global)', desc: 'Best match worldwide (ECMWF, DWD, JMA, NOAA)' },
              { id: 'icon', label: 'DWD ICON (Europe & Global)', desc: 'German Weather Service high-precision model' },
              { id: 'jma', label: 'JMA (Asia & Global)', desc: 'Japan Meteorological Agency high-resolution model' },
              { id: 'gfs', label: 'NOAA GFS (US & Global)', desc: 'US National Weather Service global model' },
            ].map((p) => {
              const isSelected = forecastProvider === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  activeOpacity={0.7}
                  onPress={() => setForecastProvider(p.id as any)}
                  style={[
                    styles.providerCard,
                    isSelected && { borderColor: accentColor, backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                  ]}
                >
                  <View style={styles.providerHeader}>
                    <Text style={[styles.providerLabel, isSelected && { color: colors.white, fontWeight: '700' }]}>
                      {p.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.providerActiveIndicator, { backgroundColor: accentColor }]}>
                        <Ionicons name="checkmark" size={14} color={colors.white} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.providerDesc}>{p.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SECTION: ATTRIBUTION */}
          <Text style={[styles.sectionHeader, { marginTop: 32 }]}>DATA & ATTRIBUTION</Text>
          <Text style={styles.attributionText}>
            Forecast & geocoding data provided by Open-Meteo.com under CC BY 4.0.
          </Text>
          <Text style={styles.attributionText}>
            Simulated radar by NOAA HRRR; global precipitation radar by RainViewer API.
          </Text>
          <Text style={styles.attributionText}>
            Global surface temperature maps provided by ECCC GDPS.
          </Text>
        </ScrollView>

        {/* Windows Phone Bottom Application Bar */}
        <View
          style={[
            styles.bottomBar,
            {
              height: 68 + bottomInset,
              paddingBottom: bottomInset,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <DoneButton onPress={onClose} accentColor={accentColor} />
        </View>
      </View>
    </Modal>
  );
};

// Metro Circular Done Button with active pressed state
function DoneButton({ onPress, accentColor }: { onPress: () => void; accentColor: string }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      hitSlop={{ top: 8, bottom: 8, left: 20, right: 20 }}
      style={styles.doneBtnContainer}
      accessibilityLabel="Done"
    >
      <View
        style={[
          styles.doneBtnCircle,
          isPressed && { backgroundColor: accentColor },
        ]}
      >
        <Ionicons name="checkmark" size={24} color={colors.white} />
      </View>
      <Text style={styles.doneBtnLabel}>done</Text>
    </TouchableOpacity>
  );
}

// Windows Phone Metro ListPicker Component
function MetroListPicker<T extends string>({
  label,
  subLabel,
  value,
  options,
  onSelect,
  accentColor,
}: {
  label: string;
  subLabel?: string;
  value: T;
  options: { value: T; label: string }[];
  onSelect: (val: T) => void;
  accentColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>
      {subLabel ? <Text style={styles.pickerSubLabel}>{subLabel}</Text> : null}

      {/* Main Box */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setExpanded(!expanded)}
        style={[
          styles.pickerBox,
          expanded && { borderColor: accentColor },
        ]}
      >
        <Text style={styles.pickerValueText}>{selectedOption.label}</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="rgba(255, 255, 255, 0.75)"
        />
      </TouchableOpacity>

      {/* Expanded Options List (Inline Metro Dropdown) */}
      {expanded && (
        <View style={styles.dropdownContainer}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(opt.value);
                  setExpanded(false);
                }}
                style={[
                  styles.dropdownOption,
                  isSelected && { backgroundColor: accentColor },
                ]}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    isSelected && { color: colors.white, fontWeight: '700' },
                  ]}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={18} color={colors.white} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure OLED Black
  },
  header: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  appSuperTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: normalizeFont(12),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(48),
    fontWeight: '200',
    color: colors.white,
    letterSpacing: -1,
    lineHeight: normalizeFont(52),
    textTransform: 'lowercase',
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 8,
  },
  sectionHeader: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    color: colors.white,
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  pickerSubLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 6,
  },
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 12,
    borderRadius: 0,
  },
  pickerValueText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    color: colors.white,
  },
  dropdownContainer: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: '#000000',
    marginBottom: 6,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  dropdownOptionText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    color: 'rgba(255, 255, 255, 0.85)',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(17),
    color: colors.white,
  },
  settingSubLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
  },
  colorTileGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  colorSquareTile: {
    width: 44,
    height: 44,
    borderRadius: 0, // Strict flat Windows Phone square
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSquareTileSelected: {
    borderWidth: 3,
    borderColor: colors.white,
  },
  providerCard: {
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 0,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(15),
    color: colors.white,
  },
  providerActiveIndicator: {
    width: 22,
    height: 22,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: normalizeFont(16),
  },
  attributionText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(13),
    color: 'rgba(255, 255, 255, 0.55)',
    lineHeight: normalizeFont(18),
    marginBottom: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1B1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 100,
  },
  doneBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: horizontalScale(72),
  },
  doneBtnCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(11),
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'lowercase',
    textAlign: 'center',
  },
});
