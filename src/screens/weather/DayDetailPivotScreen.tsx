import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  BackHandler,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  Keyframe,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DailyForecast, HourlyForecast, WeatherLocation } from '../../services/weather/types';
import { WeatherIcon } from '../../components/weather/WeatherIcon';
import { HourlyGraph } from '../../components/weather/HourlyGraph';
import { MetroDivider } from '../../components/metro/MetroDivider';
import { colors, getThemeColors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale, verticalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';
import { formatTemperature, formatHumidity, formatWind } from '../../utils/formatting';

// Windows Phone Turnstile Keyframes
const TurnstileEnter = new Keyframe({
  0: {
    transform: [{ perspective: 1000 }, { rotateY: '-90deg' }],
    opacity: 0,
    // @ts-ignore
    easing: Easing.out(Easing.cubic),
  },
  100: {
    transform: [{ perspective: 1000 }, { rotateY: '0deg' }],
    opacity: 1,
  },
});

const TurnstileExit = new Keyframe({
  0: {
    transform: [{ perspective: 1000 }, { rotateY: '0deg' }],
    opacity: 1,
    // @ts-ignore
    easing: Easing.in(Easing.cubic),
  },
  100: {
    transform: [{ perspective: 1000 }, { rotateY: '-90deg' }],
    opacity: 0,
  },
});

const METRO_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);
const GAP = horizontalScale(22);

interface DayDetailPivotScreenProps {
  dailyList: DailyForecast[];
  initialIndex: number;
  location: WeatherLocation;
  hourlyList: HourlyForecast[];
  isDay?: boolean;
  onClose: () => void;
}

export const DayDetailPivotScreen: React.FC<DayDetailPivotScreenProps> = ({
  dailyList,
  initialIndex,
  location,
  hourlyList,
  isDay = true,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(initialIndex);
  const [headerWidths, setHeaderWidths] = useState<number[]>([]);
  const headerTranslateX = useSharedValue(0);
  const { temperatureUnit, windUnit, accentColor } = useSettings();
  const themeColors = getThemeColors(isDay);

  // Handle hardware back press: return to first tab if not on it, otherwise close screen
  useEffect(() => {
    const onBackPress = () => {
      if (activeDayIndex !== 0) {
        snapToDay(0);
        return true;
      }
      onClose();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [activeDayIndex, onClose]);

  // Slide pivot headers as active page changes
  useEffect(() => {
    if (headerWidths.length === 0) return;

    let offset = 0;
    for (let i = 0; i < activeDayIndex; i++) {
      offset += (headerWidths[i] || 0) + GAP;
    }

    headerTranslateX.value = withTiming(-offset, {
      duration: 300,
      easing: METRO_EASING,
    });
  }, [activeDayIndex, headerWidths]);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: headerTranslateX.value }],
    };
  });

  const snapToDay = (index: number) => {
    setActiveDayIndex(index);
    pagerRef.current?.setPage(index);
  };

  const locationDisplay = location.region
    ? `${location.cityName}, ${location.region}`.toUpperCase()
    : `${location.cityName}, ${location.country}`.toUpperCase();

  return (
    <Animated.View
      entering={TurnstileEnter.duration(280)}
      exiting={TurnstileExit.duration(220)}
      style={[
        styles.overlayContainer,
        { backgroundColor: themeColors.background, paddingTop: insets.top + 8 },
      ]}
    >
      {/* Top Location Header */}
      <View style={[styles.topHeader, { paddingHorizontal: horizontalScale(18) + insets.left }]}>
        <Text style={styles.locationTitle}>{locationDisplay}</Text>
      </View>

      {/* Sliding Day Pivot Headers */}
      <View style={[styles.pivotHeaderMask, { paddingLeft: horizontalScale(18) + insets.left }]}>
        <Animated.View style={[styles.pivotHeaderRow, headerStyle]}>
          {dailyList.map((item, index) => {
            const isActive = index === activeDayIndex;
            const dayText = `${item.dayLabel.toLowerCase()} ${item.dateFormatted.split(' ')[0]}`;
            return (
              <TouchableOpacity
                key={item.date}
                activeOpacity={0.7}
                onPress={() => snapToDay(index)}
                onLayout={(e) => {
                  const w = e.nativeEvent.layout.width;
                  setHeaderWidths((prev) => {
                    const next = [...prev];
                    next[index] = w;
                    return next;
                  });
                }}
                style={styles.pivotHeaderItem}
              >
                <Text
                  style={[
                    styles.pivotHeaderText,
                    isActive ? styles.pivotActiveText : styles.pivotInactiveText,
                  ]}
                >
                  {dayText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>

      {/* Horizontal Pager for Days */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={initialIndex}
        onPageSelected={(e) => setActiveDayIndex(e.nativeEvent.position)}
        offscreenPageLimit={2}
      >
        {dailyList.map((day, dayIndex) => {
          return (
            <View key={day.date} style={styles.dayPage}>
              <ScrollView
                style={styles.dayScroll}
                contentContainerStyle={styles.dayScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Day / Night Columns */}
                <View style={styles.twoColumnGrid}>
                  {/* Day Column */}
                  <View style={styles.column}>
                    <View style={styles.iconBox}>
                      <WeatherIcon condition={day.dayConditionCode} size={50} />
                    </View>
                    <Text style={styles.colHeader}>DAY</Text>
                    <Text style={styles.tempLarge}>
                      {formatTemperature(day.high, temperatureUnit)}
                    </Text>
                    <Text style={styles.conditionSubtext}>{day.conditionText}</Text>

                    <View style={styles.metricsList}>
                      <MetricItem
                        label="Wind"
                        value={formatWind(day.windSpeedKph ?? 15, day.windDirectionLabel, windUnit)}
                      />
                      <MetricItem
                        label="Humidity"
                        value={formatHumidity(day.humidityPercent ?? 20)}
                      />
                      {day.sunrise && <MetricItem label="Sunrise" value={day.sunrise} />}
                      <MetricItem
                        label="Precipitation"
                        value={`${day.precipitationProbability}%`}
                      />
                    </View>
                  </View>

                  {/* Vertical Divider */}
                  <View style={styles.verticalRule} />

                  {/* Night Column */}
                  <View style={styles.column}>
                    <View style={styles.iconBox}>
                      <WeatherIcon
                        condition={day.nightConditionCode || 'clear-night'}
                        size={50}
                      />
                    </View>
                    <Text style={styles.colHeader}>NIGHT</Text>
                    <Text style={styles.tempLarge}>
                      {formatTemperature(day.low, temperatureUnit)}
                    </Text>
                    <Text style={styles.conditionSubtext}>Mostly Clear</Text>

                    <View style={styles.metricsList}>
                      <MetricItem
                        label="Wind"
                        value={formatWind(
                          (day.windSpeedKph ?? 15) * 0.7,
                          day.windDirectionLabel,
                          windUnit
                        )}
                      />
                      <MetricItem
                        label="Humidity"
                        value={formatHumidity((day.humidityPercent ?? 20) + 15)}
                      />
                      {day.sunset && <MetricItem label="Sunset" value={day.sunset} />}
                      <MetricItem label="Precipitation" value="10%" />
                    </View>
                  </View>
                </View>

                <MetroDivider style={{ marginVertical: 18 }} />

                {/* Metro Hourly Forecast Graph for this Day */}
                <HourlyGraph hourlyList={day.hourlyList || hourlyList} />
              </ScrollView>
            </View>
          );
        })}
      </PagerView>

      {/* Bottom Bar with Circular Back Button */}
      <View
        style={[
          styles.bottomBar,
          {
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingLeft: horizontalScale(18) + insets.left,
            paddingRight: horizontalScale(18) + insets.right,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          style={styles.backButtonCircle}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.backLabel}>back to forecast</Text>
      </View>
    </Animated.View>
  );
};

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    zIndex: 90,
  },
  topHeader: {
    paddingHorizontal: horizontalScale(18),
    marginBottom: 4,
  },
  locationTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(17),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pivotHeaderMask: {
    height: 56,
    overflow: 'hidden',
    paddingLeft: horizontalScale(18),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  pivotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'transparent',
    gap: GAP,
  },
  pivotHeaderItem: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pivotHeaderText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(42),
    fontWeight: '200',
    letterSpacing: -1,
    lineHeight: normalizeFont(46),
    textTransform: 'lowercase',
  },
  pivotActiveText: {
    color: colors.textPrimary,
  },
  pivotInactiveText: {
    color: colors.textDim,
  },
  pager: {
    flex: 1,
  },
  dayPage: {
    flex: 1,
  },
  dayScroll: {
    flex: 1,
  },
  dayScrollContent: {
    paddingHorizontal: horizontalScale(18),
    paddingBottom: verticalScale(80),
  },
  twoColumnGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  column: {
    flex: 1,
  },
  verticalRule: {
    width: 1,
    backgroundColor: colors.dividerSubtle,
    marginHorizontal: horizontalScale(16),
  },
  iconBox: {
    height: 54,
    justifyContent: 'center',
  },
  colHeader: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
    marginTop: 4,
  },
  tempLarge: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(54),
    fontWeight: '200',
    color: colors.textPrimary,
    lineHeight: normalizeFont(58),
    letterSpacing: -1,
  },
  conditionSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(15),
    color: colors.textSecondary,
    marginBottom: 16,
  },
  metricsList: {
    gap: 8,
  },
  metricItem: {
    paddingVertical: 2,
  },
  metricLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(13),
    color: colors.textDim,
  },
  metricValue: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(15),
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: horizontalScale(18),
    borderTopWidth: 1,
    borderTopColor: colors.dividerSubtle,
    backgroundColor: '#1C1B1A',
  },
  backButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  backLabel: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(16),
    color: colors.textSecondary,
    textTransform: 'lowercase',
  },
});
