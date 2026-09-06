import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/tokens';

interface MetroDividerProps {
  style?: ViewStyle;
  subtle?: boolean;
}

export const MetroDivider: React.FC<MetroDividerProps> = ({ style, subtle = false }) => {
  return (
    <View
      style={[
        styles.divider,
        subtle && styles.subtle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    width: '100%',
  },
  subtle: {
    backgroundColor: colors.dividerSubtle,
  },
});
