import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurrentWeather, WeatherLocation } from '../../services/weather/types';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';
import { convertTemperature } from '../../utils/units';
import {
  formatVisibility,
  formatPressure,
  formatWind,
} from '../../utils/formatting';

interface TodayScreenProps {
  current: CurrentWeather;
  location: WeatherLocation;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  current,
  refreshing = false,
  onRefresh,
}) => {
  const insets = useSafeAreaInsets();
  const { temperatureUnit, windUnit, pressureUnit, distanceUnit } = useSettings();

  const heroTempNum = convertTemperature(current.temperature, temperatureUnit);
  const todayHighNum = convertTemperature(current.todayHigh ?? current.temperature, temperatureUnit);
  const tonightLowNum = convertTemperature(current.todayLow ?? current.temperature - 6, temperatureUnit);
  const feelsLikeNum = convertTemperature(current.feelsLike, temperatureUnit);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textPrimary}
            colors={[colors.textPrimary]}
          />
        ) : undefined
      }
    >
      {/* Lower Section: Hero Temp + Condition anchored right above the divider, followed by details */}
      <View style={[styles.bottomSection, { paddingBottom: 68 + insets.bottom + 8 }]}>
        {/* Massive Numerals & Superscript Unit */}
        <View style={styles.heroTempRow}>
          <Text style={styles.heroTempNum}>{heroTempNum}</Text>
          <Text style={styles.heroTempUnit}>°{temperatureUnit}</Text>
        </View>

        {/* Current Condition Text (e.g. Sunny / Mostly Clear / Cloudy) */}
        <View style={styles.conditionContainer}>
          <Text style={styles.conditionText}>{current.conditionText}</Text>
        </View>

        {/* Thin Metro Divider */}
        <View style={styles.divider} />

        {/* Two-Column Weather Information Section */}
        <View style={styles.twoColumnGrid}>
          {/* Left Column: Today High / Tonight Low */}
          <View style={styles.leftColumn}>
            {/* Today */}
            <View style={styles.periodRow}>
              <Text style={styles.periodTemp}>{todayHighNum}°</Text>
              <View style={styles.periodTextGroup}>
                <Text style={styles.periodTitle} numberOfLines={1}>Today</Text>
                <Text style={styles.periodCondition} numberOfLines={1} ellipsizeMode="tail">
                  {current.todayConditionText || current.conditionText}
                </Text>
              </View>
            </View>

            {/* Tonight */}
            <View style={[styles.periodRow, { marginTop: 14 }]}>
              <Text style={styles.periodTemp}>{tonightLowNum}°</Text>
              <View style={styles.periodTextGroup}>
                <Text style={styles.periodTitle} numberOfLines={1}>Tonight</Text>
                <Text style={styles.periodCondition} numberOfLines={1} ellipsizeMode="tail">
                  {current.tonightConditionText || 'Partly Cloudy'}
                </Text>
              </View>
            </View>

            {/* Provider attribution mark at bottom left */}
            <Text style={styles.attributionText}>WDT</Text>
          </View>

          {/* Right Column: Key Environmental Statistics */}
          <View style={styles.rightColumn}>
            <MetricRow
              label="Feels Like"
              value={`${feelsLikeNum}°`}
            />
            <MetricRow
              label="Humidity"
              value={`${Math.round(current.humidityPercent)} %`}
            />
            <MetricRow
              label="Visibility"
              value={formatVisibility(current.visibilityKm, distanceUnit)}
            />
            <MetricRow
              label="Barometer"
              value={formatPressure(current.pressureHpa, pressureUnit)}
            />
            <MetricRow
              label="Wind"
              value={formatWind(current.windSpeedKph, current.windDirectionLabel, windUnit)}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: horizontalScale(18),
  },
  heroTempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroTempNum: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(156),
    fontWeight: '200',
    color: colors.white,
    lineHeight: normalizeFont(156),
    letterSpacing: -5,
  },
  heroTempUnit: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(52),
    fontWeight: '200',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
    marginLeft: 3,
    lineHeight: normalizeFont(58),
  },
  conditionContainer: {
    marginTop: 2,
    marginBottom: 16,
  },
  conditionText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(28),
    fontWeight: '400',
    color: colors.white,
    lineHeight: normalizeFont(34),
  },
  bottomSection: {
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginBottom: 14,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1.25,
    paddingRight: horizontalScale(8),
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(46),
    fontWeight: '200',
    color: colors.white,
    minWidth: horizontalScale(54),
    lineHeight: normalizeFont(48),
    letterSpacing: -1,
  },
  periodTextGroup: {
    flex: 1,
    marginLeft: horizontalScale(8),
    justifyContent: 'center',
  },
  periodTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(15),
    fontWeight: '600',
    color: colors.white,
    lineHeight: normalizeFont(20),
  },
  periodCondition: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(13),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: normalizeFont(17),
    marginTop: 2,
  },
  attributionText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 18,
  },
  rightColumn: {
    flex: 1.12,
    gap: 7,
    justifyContent: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 1,
  },
  metricLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  metricValue: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    fontWeight: '400',
    color: colors.white,
    textAlign: 'right',
  },
});
