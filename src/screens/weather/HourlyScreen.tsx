import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HourlyForecast } from '../../services/weather/types';
import { HourlyRow } from '../../components/weather/HourlyRow';
import { colors } from '../../theme/tokens';

interface HourlyScreenProps {
  hourlyList: HourlyForecast[];
}

export const HourlyScreen: React.FC<HourlyScreenProps> = ({ hourlyList }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: 72 + insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {hourlyList.map((item, index) => (
        <HourlyRow key={`${item.time}-${index}`} forecast={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 110,
  },
});
