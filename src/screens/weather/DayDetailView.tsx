import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DailyForecast, HourlyForecast } from '../../services/weather/types';
import { WeatherIcon } from '../../components/weather/WeatherIcon';
import { HourlyGraph } from '../../components/weather/HourlyGraph';
import { MetroDivider } from '../../components/metro/MetroDivider';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';
import { formatTemperature, formatHumidity, formatWind } from '../../utils/formatting';

interface DayDetailViewProps {
  dailyList: DailyForecast[];
  selectedIndex: number;
  onSelectDay: (index: number) => void;
  onClose: () => void;
  hourlyList: HourlyForecast[];
}

export const DayDetailView: React.FC<DayDetailViewProps> = ({
  dailyList,
  selectedIndex,
  onSelectDay,
  onClose,
  hourlyList,
}) => {
  const { temperatureUnit, windUnit, accentColor } = useSettings();
  const currentDay = dailyList[selectedIndex] || dailyList[0];

  return (
    <View style={styles.container}>
      {/* Horizontally scrollable day tabs: fri 23 sat 24 sun 25... */}
      <View style={styles.dayTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {dailyList.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <TouchableOpacity
                key={item.date}
                activeOpacity={0.7}
                onPress={() => onSelectDay(idx)}
                style={styles.tabItem}
              >
                <Text
                  style={[
                    styles.tabText,
                    isSelected && { color: colors.textPrimary, borderBottomColor: accentColor, borderBottomWidth: 3 },
                  ]}
                >
                  {item.dayLabel.toLowerCase()} {item.dateFormatted.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Day / Night Columns */}
        <View style={styles.twoColumnGrid}>
          {/* Day Column */}
          <View style={styles.column}>
            <View style={styles.iconContainer}>
              <WeatherIcon condition={currentDay.dayConditionCode} size={48} />
            </View>
            <Text style={styles.columnHeader}>DAY</Text>
            <Text style={styles.tempLarge}>
              {formatTemperature(currentDay.high, temperatureUnit)}
            </Text>
            <Text style={styles.conditionText}>{currentDay.conditionText}</Text>

            <View style={styles.metricsList}>
              <DetailItem label="Wind" value={formatWind(currentDay.windSpeedKph ?? 15, currentDay.windDirectionLabel, windUnit)} />
              <DetailItem label="Humidity" value={formatHumidity(currentDay.humidityPercent ?? 25)} />
              {currentDay.sunrise && <DetailItem label="Sunrise" value={currentDay.sunrise} />}
              <DetailItem label="Precipitation" value={`${currentDay.precipitationProbability}%`} />
            </View>
          </View>

          {/* Vertical Divider */}
          <View style={styles.verticalRule} />

          {/* Night Column */}
          <View style={styles.column}>
            <View style={styles.iconContainer}>
              <WeatherIcon condition={currentDay.nightConditionCode || 'clear-night'} size={48} />
            </View>
            <Text style={styles.columnHeader}>NIGHT</Text>
            <Text style={styles.tempLarge}>
              {formatTemperature(currentDay.low, temperatureUnit)}
            </Text>
            <Text style={styles.conditionText}>Mostly Clear</Text>

            <View style={styles.metricsList}>
              <DetailItem label="Wind" value={formatWind((currentDay.windSpeedKph ?? 15) * 0.7, currentDay.windDirectionLabel, windUnit)} />
              <DetailItem label="Humidity" value={formatHumidity((currentDay.humidityPercent ?? 25) + 15)} />
              {currentDay.sunset && <DetailItem label="Sunset" value={currentDay.sunset} />}
              <DetailItem label="Precipitation" value="10%" />
            </View>
          </View>
        </View>

        <MetroDivider style={{ marginVertical: 18 }} />

        {/* Metro Hourly Graph */}
        <HourlyGraph hourlyList={currentDay.hourlyList || hourlyList} />
      </ScrollView>
    </View>
  );
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dayTabsContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerSubtle,
  },
  tabsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    gap: horizontalScale(20),
  },
  tabItem: {
    paddingVertical: 8,
  },
  tabText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(20),
    fontWeight: '300',
    color: colors.textDim,
    paddingBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: 16,
    paddingBottom: 100,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  verticalRule: {
    width: 1,
    backgroundColor: colors.dividerSubtle,
    marginHorizontal: horizontalScale(16),
  },
  iconContainer: {
    height: 52,
    justifyContent: 'center',
  },
  columnHeader: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
    marginTop: 4,
  },
  tempLarge: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(52),
    fontWeight: '200',
    color: colors.textPrimary,
    lineHeight: normalizeFont(56),
    letterSpacing: -1,
  },
  conditionText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    color: colors.textSecondary,
    marginBottom: 16,
  },
  metricsList: {
    gap: 8,
  },
  detailRow: {
    paddingVertical: 2,
  },
  detailLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    color: colors.textDim,
  },
  detailVal: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(15),
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 1,
  },
});
