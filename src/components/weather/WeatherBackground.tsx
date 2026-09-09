import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WeatherConditionCode } from '../../services/weather/types';
import { useSettings } from '../../state/settingsStore';

interface WeatherBackgroundProps {
  condition: WeatherConditionCode;
  isDay?: boolean;
  children: React.ReactNode;
}

// Daytime weather backgrounds (curated high-res atmospheric photography)
const BACKGROUND_IMAGES_DAY: Record<WeatherConditionCode, string> = {
  'clear-day': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1200&auto=format&fit=crop',
  'clear-night': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1200&auto=format&fit=crop',
  'partly-cloudy-day': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1200&auto=format&fit=crop',
  'partly-cloudy-night': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1200&auto=format&fit=crop',
  'cloudy': 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1200&auto=format&fit=crop',
  'overcast': 'https://images.unsplash.com/photo-1499956827185-0d63ee78a910?q=80&w=1200&auto=format&fit=crop',
  'fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1200&auto=format&fit=crop',
  'drizzle': 'https://images.unsplash.com/photo-1556484687-30636164638a?q=80&w=1200&auto=format&fit=crop',
  'rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1200&auto=format&fit=crop',
  'heavy-rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1200&auto=format&fit=crop',
  'thunderstorm': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1200&auto=format&fit=crop',
  'snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1200&auto=format&fit=crop',
  'sleet': 'https://images.unsplash.com/photo-1517758478390-c89333af4a0e?q=80&w=1200&auto=format&fit=crop',
  'wind': 'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=1200&auto=format&fit=crop',
  'haze': 'https://images.unsplash.com/photo-1508873696983-2df57046475a?q=80&w=1200&auto=format&fit=crop',
  'unknown': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1200&auto=format&fit=crop',
};

// Nighttime weather backgrounds (rich nocturnal photography, starry skies, illuminated rain/snow)
const BACKGROUND_IMAGES_NIGHT: Record<WeatherConditionCode, string> = {
  'clear-day': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop',
  'clear-night': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop',
  'partly-cloudy-day': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1200&auto=format&fit=crop',
  'partly-cloudy-night': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1200&auto=format&fit=crop',
  'cloudy': 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1200&auto=format&fit=crop',
  'overcast': 'https://images.unsplash.com/photo-1514477917009-389c76a86b68?q=80&w=1200&auto=format&fit=crop',
  'fog': 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=1200&auto=format&fit=crop',
  'drizzle': 'https://images.unsplash.com/photo-1438449805896-28a666819a20?q=80&w=1200&auto=format&fit=crop',
  'rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format&fit=crop',
  'heavy-rain': 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=1200&auto=format&fit=crop',
  'thunderstorm': 'https://images.unsplash.com/photo-1511289081-d06dda19034d?q=80&w=1200&auto=format&fit=crop',
  'snow': 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1200&auto=format&fit=crop',
  'sleet': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  'wind': 'https://images.unsplash.com/photo-1505672678570-369f49377484?q=80&w=1200&auto=format&fit=crop',
  'haze': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200&auto=format&fit=crop',
  'unknown': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop',
};

export function getConditionBackgroundImage(condition: WeatherConditionCode, isDay = true): string {
  const dictionary = isDay ? BACKGROUND_IMAGES_DAY : BACKGROUND_IMAGES_NIGHT;
  return dictionary[condition] || (isDay ? BACKGROUND_IMAGES_DAY['clear-day'] : BACKGROUND_IMAGES_NIGHT['clear-night']);
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  condition,
  isDay = true,
  children,
}) => {
  const { useImageryBackground } = useSettings();
  const imageUrl = getConditionBackgroundImage(condition, isDay);

  const bgColor = isDay ? '#1558B0' : '#09162A';
  const scrimColor = isDay ? 'rgba(15, 65, 140, 0.42)' : 'rgba(7, 18, 35, 0.65)';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {useImageryBackground && imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : null}

      {/* Atmospheric Vignette Overlay for Metro readability */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: scrimColor }]} />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
