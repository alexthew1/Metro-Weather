import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolate, interpolateColor, Easing } from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { useSettings } from '../../state/settingsStore';

const METRO_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);

interface MetroToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export const MetroToggle: React.FC<MetroToggleProps> = ({ value, onValueChange }) => {
  const { accentColor } = useSettings();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: 200,
      easing: METRO_EASING,
    });
  }, [value]);

  const TRACK_WIDTH = 84;
  const TRACK_HEIGHT = 30;
  const BORDER_WIDTH = 2;
  const OUTLINE_GAP = 2;
  const SWITCH_GAP = 1;
  const THUMB_WIDTH = 16;
  const THUMB_HEIGHT = 36;
  const THUMB_BORDER = 1;
  const THUMB_OVERFLOW_Y = (THUMB_HEIGHT - TRACK_HEIGHT) / 2;

  const minLeft = -THUMB_BORDER;
  const maxLeft = TRACK_WIDTH - THUMB_WIDTH + THUMB_BORDER;

  const innerTrackWidth = TRACK_WIDTH - BORDER_WIDTH * 2;
  const maxFillWidth = Math.max(0, innerTrackWidth - (THUMB_WIDTH - THUMB_BORDER) - SWITCH_GAP);

  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(progress.value, [0, 1], [colors.textDim, colors.textPrimary]),
    };
  });

  const fillAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(progress.value, [0, 1], [0, maxFillWidth]),
      backgroundColor: accentColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: interpolate(progress.value, [0, 1], [minLeft, maxLeft]),
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.textDim, colors.textPrimary]),
      borderColor: colors.background,
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onValueChange(!value)}
      style={styles.touchable}
    >
      <View style={[styles.container, { width: TRACK_WIDTH, height: THUMB_HEIGHT }]}>
        {/* Track Box */}
        <Animated.View
          style={[
            styles.track,
            {
              width: TRACK_WIDTH,
              height: TRACK_HEIGHT,
              borderWidth: BORDER_WIDTH,
              top: THUMB_OVERFLOW_Y,
            },
            borderAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                height: TRACK_HEIGHT - BORDER_WIDTH * 2 - OUTLINE_GAP * 2,
                marginTop: OUTLINE_GAP,
                marginLeft: OUTLINE_GAP,
              },
              fillAnimatedStyle,
            ]}
          />
        </Animated.View>

        {/* Thumb Slider */}
        <Animated.View
          style={[
            styles.thumb,
            {
              width: THUMB_WIDTH,
              height: THUMB_HEIGHT,
              borderWidth: THUMB_BORDER,
              top: 0,
            },
            thumbAnimatedStyle,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    paddingVertical: 4,
  },
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  fill: {
    width: 0,
  },
  thumb: {
    position: 'absolute',
  },
});
