import { StyleSheet, Platform } from 'react-native';
import { normalizeFont } from '../utils/responsive';
import { colors } from './tokens';

// Font configuration
// Uses Open Sans / system light fonts with Segoe-inspired styling
export const fontFamilies = {
  light: Platform.select({
    ios: 'OpenSans_300Light',
    android: 'OpenSans_300Light',
    default: 'sans-serif-light',
  }),
  regular: Platform.select({
    ios: 'OpenSans_400Regular',
    android: 'OpenSans_400Regular',
    default: 'sans-serif',
  }),
  semiBold: Platform.select({
    ios: 'OpenSans_600SemiBold',
    android: 'OpenSans_600SemiBold',
    default: 'sans-serif-medium',
  }),
  bold: Platform.select({
    ios: 'OpenSans_700Bold',
    android: 'OpenSans_700Bold',
    default: 'sans-serif',
  }),
};

export const typography = StyleSheet.create({
  // Panorama Header
  panoramaActive: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(46),
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: normalizeFont(52),
    letterSpacing: -1,
  },
  panoramaInactive: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(46),
    fontWeight: '300',
    color: colors.textDim,
    lineHeight: normalizeFont(52),
    letterSpacing: -1,
  },

  // Location Title
  locationHeading: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(20),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // Hero Current Temperature
  heroTemperature: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(110),
    fontWeight: '200',
    color: colors.textPrimary,
    lineHeight: normalizeFont(114),
    letterSpacing: -3,
  },
  heroDegreeUnit: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(54),
    fontWeight: '300',
    color: colors.textPrimary,
  },

  // Condition Text
  conditionHero: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(26),
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: normalizeFont(30),
  },

  // Today Two-Column Section
  metricSectionTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(16),
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metricSectionTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(46),
    fontWeight: '200',
    color: colors.textPrimary,
    lineHeight: normalizeFont(48),
  },
  metricSectionCondition: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(15),
    fontWeight: '400',
    color: colors.textSecondary,
  },
  detailMetricLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    fontWeight: '400',
    color: colors.textDim,
  },
  detailMetricValue: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(16),
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Forecast Rows
  forecastRowDate: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(22),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  forecastRowDay: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    fontWeight: '400',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  forecastHighTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(42),
    fontWeight: '300',
    color: colors.textPrimary,
  },
  forecastLowTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(30),
    fontWeight: '300',
    color: colors.textDim,
  },
  forecastPrecip: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    fontWeight: '400',
    color: colors.textSecondary,
  },

  // Hourly List
  hourlyTime: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(18),
    fontWeight: '400',
    color: colors.textPrimary,
  },
  hourlyTemp: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(36),
    fontWeight: '300',
    color: colors.textPrimary,
  },

  // Application Bar
  appBarLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  appBarMenuItem: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(22),
    fontWeight: '300',
    color: colors.textPrimary,
  },
});
