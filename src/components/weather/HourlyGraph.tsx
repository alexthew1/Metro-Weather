import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { HourlyForecast } from '../../services/weather/types';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';
import { convertTemperature } from '../../utils/units';

interface HourlyGraphProps {
  hourlyList: HourlyForecast[];
}

export const HourlyGraph: React.FC<HourlyGraphProps> = ({ hourlyList }) => {
  const { temperatureUnit, accentColor } = useSettings();

  if (!hourlyList || hourlyList.length === 0) return null;

  // Chart Dimensions - Increased height to guarantee chance of rain and bars are never cut off
  const pointWidth = 62;
  const chartHeight = 176;
  const topPadding = 28;
  const graphInnerHeight = 60;
  const baselineY = topPadding + graphInnerHeight + 14; // ~102
  const totalWidth = Math.max(hourlyList.length * pointWidth, 340);

  // Convert temps
  const temps = hourlyList.map((h) => convertTemperature(h.temperature, temperatureUnit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(maxTemp - minTemp, 1);

  // Calculate points
  const points = hourlyList.map((h, i) => {
    const x = i * pointWidth + pointWidth / 2;
    const tempVal = temps[i];
    const normalizedY = (maxTemp - tempVal) / tempRange;
    const y = topPadding + normalizedY * graphInnerHeight;
    return { x, y, tempVal, forecast: h };
  });

  // Construct SVG Path
  let pathD = '';
  points.forEach((p, idx) => {
    if (idx === 0) {
      pathD += `M ${p.x} ${p.y}`;
    } else {
      const prev = points[idx - 1];
      const cx1 = prev.x + (p.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (p.x - prev.x) / 2;
      const cy2 = p.y;
      pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>HOURLY FORECAST</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: totalWidth }}
      >
        <View style={{ width: totalWidth, height: chartHeight }}>
          <Svg width={totalWidth} height={chartHeight}>
            {/* Subtle horizontal baseline matching Bing Weather reference */}
            <Line
              x1="0"
              y1={baselineY}
              x2={totalWidth}
              y2={baselineY}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />

            {/* Vibrant Metro Orange Temperature Curve */}
            <Path
              d={pathD}
              fill="none"
              stroke="#FF9100"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Circular Markers */}
            {points.map((p, idx) => (
              <Circle
                key={`dot-${idx}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#FF9100"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}
          </Svg>

          {/* Value Labels positioned over SVG */}
          {points.map((p, idx) => {
            const precip = p.forecast.precipitationProbability ?? 0;
            return (
              <View
                key={`label-${idx}`}
                style={[
                  styles.pointOverlay,
                  { left: p.x - pointWidth / 2, width: pointWidth },
                ]}
              >
                {/* Temperature above point in orange numerals matching reference */}
                <Text style={[styles.tempLabel, { top: Math.max(2, p.y - 22) }]}>
                  {p.tempVal}°
                </Text>

                {/* Precipitation percentage below baseline */}
                <View style={[styles.precipRow, { top: baselineY + 6 }]}>
                  <Text style={styles.precipPercent}>
                    {precip > 0 ? `${precip}%` : '0%'}
                  </Text>
                </View>

                {/* Metro blue precipitation bar block (matching reference screenshot) */}
                <View
                  style={[
                    styles.precipBar,
                    {
                      top: baselineY + 24,
                      backgroundColor:
                        precip > 0
                          ? 'rgba(255, 255, 255, 0.28)'
                          : 'rgba(255, 255, 255, 0.08)',
                      height: Math.max(4, Math.round((precip / 100) * 14) + 4),
                    },
                  ]}
                />

                {/* Time label below precip bar */}
                <View style={[styles.timeRow, { top: baselineY + 44 }]}>
                  <Text style={styles.timeLabel}>{p.forecast.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionHeader: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(14),
    fontWeight: '600',
    letterSpacing: 1.2,
    color: colors.white,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pointOverlay: {
    position: 'absolute',
    alignItems: 'center',
    height: '100%',
  },
  tempLabel: {
    position: 'absolute',
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(13),
    color: '#FF9100',
    fontWeight: '600',
    textAlign: 'center',
  },
  precipRow: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  precipPercent: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(12),
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  precipBar: {
    position: 'absolute',
    width: 32,
    borderRadius: 0,
  },
  timeRow: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  timeLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(11),
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
  },
});
