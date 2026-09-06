import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';

interface MetroTopBarProps {
  title?: string;
}

export const MetroTopBar: React.FC<MetroTopBarProps> = ({ title = 'Metro Weather' }) => {
  const insets = useSafeAreaInsets();
  const { showTopBar } = useSettings();

  if (!showTopBar) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#0067C5',
          paddingTop: Math.max(insets.top, 6),
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 5,
    paddingHorizontal: horizontalScale(16),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 22,
  },
  titleText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    fontWeight: '500',
    color: colors.white,
    letterSpacing: 0.3,
  },
});
