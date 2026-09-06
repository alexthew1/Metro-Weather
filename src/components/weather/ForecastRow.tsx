import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyForecast } from '../../services/weather/types';
import { WeatherIcon } from './WeatherIcon';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';
import { formatTemperature, formatPrecipitation } from '../../utils/formatting';

interface ForecastRowProps {
  forecast: DailyForecast;
  onPress?: () => void;
  isSelected?: boolean;
}

export const ForecastRow: React.FC<ForecastRowProps> = ({ forecast, onPress, isSelected }) => {
  const { temperatureUnit, accentColor } = useSettings();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.rowContainer,
        isSelected && { borderColor: accentColor, borderWidth: 1.5 },
      ]}
    >
      {/* Left: Date + Abbreviated Weekday */}
      <View style={styles.leftCol}>
        <Text style={styles.dateText}>{forecast.dateFormatted}</Text>
      </View>

      {/* Center: Weather Icon */}
      <View style={styles.centerIconCol}>
        <WeatherIcon condition={forecast.dayConditionCode} size={42} />
      </View>

      {/* Right-Center: High above Low */}
      <View style={styles.tempCol}>
        <Text style={styles.highTemp}>
          {formatTemperature(forecast.high, temperatureUnit)}
        </Text>
        <Text style={styles.lowTemp}>
          {formatTemperature(forecast.low, temperatureUnit)}
        </Text>
      </View>

      {/* Far Right: Precipitation % + droplet */}
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
            <Text style={[styles.precipText, { opacity: 0.3 }]}>0%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    backgroundColor: colors.cardBg,
    marginBottom: 4,
    paddingHorizontal: horizontalScale(16),
    borderRadius: 0, // Strict flat Metro rule
  },
  leftCol: {
    width: horizontalScale(100),
  },
  dateText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(20),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  centerIconCol: {
    flex: 1,
    alignItems: 'center',
  },
  tempCol: {
    width: horizontalScale(80),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  highTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(28),
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: normalizeFont(30),
  },
  lowTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(20),
    fontWeight: '300',
    color: colors.textDim,
    lineHeight: normalizeFont(22),
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
});
