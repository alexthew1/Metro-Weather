import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HourlyForecast } from '../../services/weather/types';
import { WeatherIcon } from './WeatherIcon';
import { MetroDivider } from '../metro/MetroDivider';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';
import { formatTemperature, formatPrecipitation } from '../../utils/formatting';

interface HourlyRowProps {
  forecast: HourlyForecast;
}

export const HourlyRow: React.FC<HourlyRowProps> = ({ forecast }) => {
  const { temperatureUnit } = useSettings();

  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        {/* Left: Time */}
        <View style={styles.timeCol}>
          <Text style={styles.timeText}>{forecast.time}</Text>
        </View>

        {/* Center-Left: Weather Icon */}
        <View style={styles.iconCol}>
          <WeatherIcon condition={forecast.conditionCode} size={44} />
        </View>

        {/* Center-Right: Large Temperature */}
        <View style={styles.tempCol}>
          <Text style={styles.tempText}>
            {formatTemperature(forecast.temperature, temperatureUnit)}
          </Text>
        </View>

        {/* Far Right: Precipitation % + Droplet */}
        <View style={styles.precipCol}>
          {forecast.precipitationProbability > 0 ? (
            <View style={styles.precipRow}>
              <Text style={styles.precipText}>
                {formatPrecipitation(forecast.precipitationProbability)}
              </Text>
              <Ionicons name="water" size={14} color={colors.droplet} style={styles.dropletIcon} />
            </View>
          ) : (
            <View style={styles.precipRow}>
              <Text style={[styles.precipText, { opacity: 0.35 }]}>0%</Text>
            </View>
          )}
        </View>
      </View>

      <MetroDivider subtle style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: horizontalScale(16),
  },
  timeCol: {
    width: horizontalScale(90),
  },
  timeText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(18),
    fontWeight: '400',
    color: colors.textPrimary,
  },
  iconCol: {
    flex: 1,
    alignItems: 'center',
  },
  tempCol: {
    width: horizontalScale(90),
    alignItems: 'flex-end',
  },
  tempText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(36),
    fontWeight: '200',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  precipCol: {
    width: horizontalScale(70),
    alignItems: 'flex-end',
  },
  precipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precipText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(15),
    fontWeight: '400',
    color: colors.textSecondary,
  },
  dropletIcon: {
    marginLeft: 3,
  },
  divider: {
    marginHorizontal: horizontalScale(16),
  },
});
