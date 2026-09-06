import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';

interface MetroButtonProps {
  onPress: () => void;
  title?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'accent' | 'outlined' | 'text';
}

const METRO_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);

export const MetroButton: React.FC<MetroButtonProps> = ({
  onPress,
  title,
  icon,
  style,
  textStyle,
  variant = 'outlined',
}) => {
  const scale = useSharedValue(1);
  const rotateYVal = useSharedValue(0);
  const buttonWidth = useSharedValue(100);
  const [isPressed, setIsPressed] = useState(false);
  const { accentColor } = useSettings();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { scale: scale.value },
        { rotateY: `${rotateYVal.value}deg` },
      ],
    };
  });

  const updateTilt = (locX: number, duration: number = 80) => {
    const w = buttonWidth.value || 100;
    const normalizedX = Math.max(-1.2, Math.min(1.2, (locX / w) * 2 - 1));
    const maxRotate = 15;
    rotateYVal.value = withTiming(normalizedX * maxRotate, { duration, easing: METRO_EASING });
  };

  const handlePressIn = (e: any) => {
    setIsPressed(true);
    updateTilt(e.nativeEvent.locationX, 100);
    scale.value = withTiming(0.94, { duration: 100, easing: METRO_EASING });
  };

  const handleTouchMove = (e: any) => {
    updateTilt(e.nativeEvent.locationX, 50);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    rotateYVal.value = withTiming(0, { duration: 150, easing: METRO_EASING });
    scale.value = withTiming(1, { duration: 150, easing: METRO_EASING });
  };

  const getBaseStyle = () => {
    switch (variant) {
      case 'accent':
        return { backgroundColor: accentColor, borderWidth: 2.5, borderColor: accentColor };
      case 'text':
        return { backgroundColor: 'transparent' };
      case 'outlined':
      default:
        return { borderWidth: 2.5, borderColor: colors.textPrimary, backgroundColor: 'transparent' };
    }
  };

  const getPressedStyle = () => {
    switch (variant) {
      case 'accent':
        return { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary };
      case 'text':
        return { backgroundColor: colors.cardPressed };
      default:
        return { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'accent':
        return { color: colors.white };
      case 'text':
        return { color: accentColor };
      default:
        return { color: colors.textPrimary };
    }
  };

  const getPressedTextStyle = () => {
    return { color: colors.background };
  };

  const handleLayout = (e: any) => {
    buttonWidth.value = e.nativeEvent.layout.width;
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onTouchMove={handleTouchMove}
      onLayout={handleLayout}
    >
      <Animated.View
        style={[
          styles.base,
          getBaseStyle(),
          style,
          isPressed && getPressedStyle(),
          animatedStyle,
        ]}
      >
        {icon}
        {title && (
          <Text
            style={[
              styles.text,
              getTextStyle(),
              textStyle,
              isPressed && getPressedTextStyle(),
              !!icon && { marginLeft: 8 },
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 0, // strict Metro rule: no rounded corners
  },
  text: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(18),
    fontWeight: '400',
  },
});
