import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { WeatherConditionCode } from '../../services/weather/types';
import { colors } from '../../theme/tokens';

interface WeatherIconProps {
  condition: WeatherConditionCode;
  size?: number;
  style?: ViewStyle;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, size = 48, style }) => {
  const renderIcon = () => {
    switch (condition) {
      case 'clear-day':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Sun Rays */}
            <Path
              d="M32 6v6M32 52v6M6 32h6M52 32h6M13.6 13.6l4.2 4.2M46.2 46.2l4.2 4.2M13.6 50.4l4.2-4.2M46.2 17.8l4.2-4.2"
              stroke="#FFA000"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Sun Body */}
            <Circle cx="32" cy="32" r="14" fill="#FFC107" />
          </Svg>
        );

      case 'clear-night':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Crescent Moon */}
            <Path
              d="M38 12c-12 0-22 10-22 22s10 22 22 22c5.8 0 11-2.3 15-6-13-1-23-11.8-23-25 0-4.6 1.3-8.8 3.5-12.4-3.3-.4-6.8-.6-10.5-.6z"
              fill="#FFD54F"
            />
          </Svg>
        );

      case 'partly-cloudy-day':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Sun behind cloud */}
            <G transform="translate(-4, -6)">
              <Path
                d="M44 14v4M44 42v4M28 28h4M56 28h4M32.7 16.7l2.8 2.8M52.5 36.5l2.8 2.8M32.7 39.3l2.8-2.8M52.5 19.5l2.8-2.8"
                stroke="#FFA000"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <Circle cx="44" cy="28" r="9" fill="#FFC107" />
            </G>
            {/* Forefront Cloud */}
            <Path
              d="M20 48h26a12 12 0 001.2-23.9 14 14 0 00-26.4-3.2A11 11 0 0020 48z"
              fill="#FFFFFF"
            />
          </Svg>
        );

      case 'partly-cloudy-night':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Moon behind cloud */}
            <Path
              d="M42 16c-7 0-13 5.5-13 12.5 0 2.2.5 4.3 1.5 6.2 3.8-2 8.3-3.2 13-3.2 2.5 0 5 .3 7.3 1-1.3-9.5-9.3-16.5-18.8-16.5z"
              fill="#FFD54F"
            />
            {/* Cloud */}
            <Path
              d="M20 48h26a12 12 0 001.2-23.9 14 14 0 00-26.4-3.2A11 11 0 0020 48z"
              fill="#EEEEEE"
            />
          </Svg>
        );

      case 'cloudy':
      case 'overcast':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M24 38h24a10 10 0 001-19.9 12 12 0 00-22.5-2.7A9.5 9.5 0 0024 38z"
              fill="#B0BEC5"
            />
            <Path
              d="M18 50h28a11 11 0 001.2-21.9 13 13 0 00-24.5-3A10 10 0 0018 50z"
              fill="#ECEFF1"
            />
          </Svg>
        );

      case 'drizzle':
      case 'rain':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M18 40h28a11 11 0 001.2-21.9 13 13 0 00-24.5-3A10 10 0 0018 40z"
              fill="#CFD8DC"
            />
            {/* Rain Drops */}
            <Path
              d="M22 47l-3 7M32 47l-3 7M42 47l-3 7"
              stroke="#29B6F6"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'heavy-rain':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M18 36h28a11 11 0 001.2-21.9 13 13 0 00-24.5-3A10 10 0 0018 36z"
              fill="#90A4AE"
            />
            {/* Heavy Rain Drops */}
            <Path
              d="M20 44l-4 9M30 44l-4 9M40 44l-4 9M26 53l-3 7M36 53l-3 7"
              stroke="#039BE5"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'thunderstorm':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M18 36h28a11 11 0 001.2-21.9 13 13 0 00-24.5-3A10 10 0 0018 36z"
              fill="#546E7A"
            />
            {/* Lightning bolt */}
            <Path
              d="M32 38l-4 9h6l-3 10 9-12h-6l4-7h-6z"
              fill="#FFD600"
              stroke="#FFAB00"
              strokeWidth="1"
            />
          </Svg>
        );

      case 'snow':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M18 38h28a11 11 0 001.2-21.9 13 13 0 00-24.5-3A10 10 0 0018 38z"
              fill="#CFD8DC"
            />
            {/* Snowflakes */}
            <Circle cx="22" cy="48" r="2.5" fill="#FFFFFF" />
            <Circle cx="32" cy="52" r="2.5" fill="#FFFFFF" />
            <Circle cx="42" cy="48" r="2.5" fill="#FFFFFF" />
          </Svg>
        );

      case 'sleet':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M18 38h28a11 11 0 001.2-21.9 13 13 0 00-24.5-3A10 10 0 0018 38z"
              fill="#B0BEC5"
            />
            <Path d="M22 47l-3 6" stroke="#29B6F6" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="34" cy="50" r="2.5" fill="#FFFFFF" />
            <Path d="M42 47l-3 6" stroke="#29B6F6" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        );

      case 'fog':
      case 'haze':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M16 26h32M12 34h40M18 42h28M22 50h20"
              stroke="#B0BEC5"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'wind':
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M10 26h30a6 6 0 10-6-6M8 34h38a5 5 0 11-5 5M12 42h22a4 4 0 10-4-4"
              stroke="#B0BEC5"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </Svg>
        );

      default:
        return (
          <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <Path
              d="M20 44h26a12 12 0 001.2-23.9 14 14 0 00-26.4-3.2A11 11 0 0020 44z"
              fill="#ECEFF1"
            />
          </Svg>
        );
    }
  };

  return <View style={[styles.container, style]}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
