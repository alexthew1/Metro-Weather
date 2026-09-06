import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';

interface MetroPanoramaHeaderProps {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  pages?: string[];
}

const DEFAULT_PAGES = ['today', 'daily', 'hourly', 'maps'];
const METRO_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);
const GAP = horizontalScale(24);

export const MetroPanoramaHeader: React.FC<MetroPanoramaHeaderProps> = ({
  activeIndex,
  onSelectIndex,
  pages = DEFAULT_PAGES,
}) => {
  const insets = useSafeAreaInsets();
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const translateX = useSharedValue(0);

  // Compute scroll offset based on active tab and measured widths
  useEffect(() => {
    if (itemWidths.length === 0) return;

    let offset = 0;
    for (let i = 0; i < activeIndex; i++) {
      offset += (itemWidths[i] || 0) + GAP;
    }

    translateX.value = withTiming(-offset, {
      duration: 320,
      easing: METRO_EASING,
    });
  }, [activeIndex, itemWidths]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.maskContainer, { paddingLeft: horizontalScale(18) + insets.left }]}>
      <Animated.View style={[styles.headerRow, animatedStyle]}>
        {pages.map((title, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={title}
              activeOpacity={0.7}
              onPress={() => onSelectIndex(index)}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                setItemWidths((prev) => {
                  const next = [...prev];
                  next[index] = w;
                  return next;
                });
              }}
              style={styles.item}
            >
              <Text
                style={[
                  styles.titleText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  maskContainer: {
    height: 56,
    overflow: 'hidden',
    paddingLeft: horizontalScale(18),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'transparent',
    gap: GAP,
  },
  item: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  titleText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(46),
    fontWeight: '200',
    letterSpacing: -1,
    lineHeight: normalizeFont(50),
    textTransform: 'lowercase',
  },
  activeText: {
    color: colors.textPrimary,
  },
  inactiveText: {
    color: colors.textDim,
  },
});
