import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DailyForecast } from '../../services/weather/types';
import { ForecastRow } from '../../components/weather/ForecastRow';
import { colors } from '../../theme/tokens';
import { horizontalScale } from '../../utils/responsive';

interface DailyScreenProps {
  dailyList: DailyForecast[];
  onSelectDay: (index: number) => void;
}

export const DailyScreen: React.FC<DailyScreenProps> = ({ dailyList, onSelectDay }) => {
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
      <View style={styles.listContainer}>
        {dailyList.map((item, index) => (
          <ForecastRow
            key={item.date}
            forecast={item}
            onPress={() => onSelectDay(index)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 110,
    paddingTop: 8,
  },
  listContainer: {
    paddingHorizontal: horizontalScale(12),
  },
});
