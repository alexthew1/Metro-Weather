import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WeatherConditionCode } from '../../services/weather/types';
import { colors } from '../../theme/tokens';
import { useSettings } from '../../state/settingsStore';

interface WeatherBackgroundProps {
  condition: WeatherConditionCode;
  isDay?: boolean;
  children: React.ReactNode;
}

// Background images mapping (using reliable, curated royalty-free atmospheric weather photography)
const BACKGROUND_IMAGES: Record<string, string> = {
  'clear-day': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1200&auto=format&fit=crop',
  'clear-night': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop',
  'partly-cloudy-day': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1200&auto=format&fit=crop',
  'partly-cloudy-night': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1200&auto=format&fit=crop',
  'cloudy': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1200&auto=format&fit=crop',
  'overcast': 'https://images.unsplash.com/photo-1499956827185-0d63ee78a910?q=80&w=1200&auto=format&fit=crop',
  'rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1200&auto=format&fit=crop',
  'heavy-rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1200&auto=format&fit=crop',
  'drizzle': 'https://images.unsplash.com/photo-1556484687-30636164638a?q=80&w=1200&auto=format&fit=crop',
  'thunderstorm': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1200&auto=format&fit=crop',
  'snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1200&auto=format&fit=crop',
  'sleet': 'https://images.unsplash.com/photo-1517758478390-c89333af4a0e?q=80&w=1200&auto=format&fit=crop',
  'fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1200&auto=format&fit=crop',
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  condition,
  isDay = true,
  children,
}) => {
  const { useImageryBackground } = useSettings();
  const defaultFallback = isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  const imageUrl = BACKGROUND_IMAGES[condition] || BACKGROUND_IMAGES[defaultFallback];

  const bgColor = isDay ? '#1558B0' : '#09162A';
  const scrimColor = isDay ? 'rgba(15, 65, 140, 0.38)' : 'rgba(7, 18, 35, 0.65)';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {useImageryBackground && imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

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
