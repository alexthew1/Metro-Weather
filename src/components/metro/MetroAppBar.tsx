import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Dimensions, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSettings } from '../../state/settingsStore';

interface MetroAppBarProps {
  onLocationsPress: () => void;
  onSearchPress: () => void;
  onCurrentLocationPress: () => void;
  onRefreshPress: () => void;
  onSettingsPress: () => void;
  onAboutPress: () => void;
  onFavoritesPress?: () => void;
}

const METRO_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);
const BAR_COLLAPSED_HEIGHT = 68;
const BAR_EXPANDED_HEIGHT = 330;

export const MetroAppBar: React.FC<MetroAppBarProps> = ({
  onLocationsPress,
  onSearchPress,
  onCurrentLocationPress,
  onRefreshPress,
  onSettingsPress,
  onAboutPress,
  onFavoritesPress,
}) => {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const expandProgress = useSharedValue(0);
  const { accentColor } = useSettings();

  const toggleExpand = (targetState: boolean) => {
    setExpanded(targetState);
    expandProgress.value = withTiming(targetState ? 1 : 0, {
      duration: 250,
      easing: METRO_EASING,
    });
  };

  // Collapse app bar menu when back button is pressed
  useEffect(() => {
    if (!expanded) return;
    const onBackPress = () => {
      toggleExpand(false);
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [expanded]);

  const containerStyle = useAnimatedStyle(() => {
    const totalCollapsed = BAR_COLLAPSED_HEIGHT + insets.bottom;
    const totalExpanded = BAR_EXPANDED_HEIGHT + insets.bottom;
    return {
      height: interpolate(expandProgress.value, [0, 1], [totalCollapsed, totalExpanded]),
      paddingBottom: insets.bottom,
    };
  });

  const expandedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(expandProgress.value, [0.3, 1], [0, 1]),
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Primary Action Button Row (Matching Windows Phone 3-button + ellipsis bar) */}
      <View
        style={[
          styles.iconRow,
          {
            paddingLeft: horizontalScale(14) + insets.left,
            paddingRight: horizontalScale(48) + insets.right,
          },
        ]}
      >
        <View style={styles.centerIcons}>
          {/* 1. Places / Locations (Globe) */}
          <AppBarCircleButton
            label="places"
            expandProgress={expandProgress}
            accentColor={accentColor}
            onPress={() => {
              if (expanded) toggleExpand(false);
              onLocationsPress();
            }}
          >
            <Feather name="globe" size={22} color={colors.white} />
          </AppBarCircleButton>

          {/* 2. Search */}
          <AppBarCircleButton
            label="search"
            expandProgress={expandProgress}
            accentColor={accentColor}
            onPress={() => {
              if (expanded) toggleExpand(false);
              onSearchPress();
            }}
          >
            <Feather name="search" size={22} color={colors.white} />
          </AppBarCircleButton>

          {/* 3. Current Location */}
          <AppBarCircleButton
            label="current"
            expandProgress={expandProgress}
            accentColor={accentColor}
            onPress={() => {
              if (expanded) toggleExpand(false);
              onCurrentLocationPress();
            }}
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color={colors.white} />
          </AppBarCircleButton>
        </View>

        {/* Ellipsis button at far right */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleExpand(!expanded)}
          style={[styles.dotsButton, { right: 10 + insets.right }]}
          accessibilityLabel="Application bar menu"
        >
          <MaterialCommunityIcons name="dots-horizontal" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Expanded Menu Actions */}
      <Animated.View
        style={[
          styles.menuList,
          expandedContentStyle,
          {
            paddingLeft: horizontalScale(24) + insets.left,
            paddingRight: horizontalScale(24) + insets.right,
          },
        ]}
      >
        <MenuItem
          label="refresh"
          onPress={() => {
            toggleExpand(false);
            onRefreshPress();
          }}
        />
        <MenuItem
          label="add location"
          onPress={() => {
            toggleExpand(false);
            onSearchPress();
          }}
        />
        <MenuItem
          label="settings"
          onPress={() => {
            toggleExpand(false);
            onSettingsPress();
          }}
        />
        <MenuItem
          label="about"
          onPress={() => {
            toggleExpand(false);
            onAboutPress();
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

// 3D Tilting Metro Circular Outline Button
function AppBarCircleButton({
  children,
  onPress,
  label,
  expandProgress,
  accentColor,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
  expandProgress: SharedValue<number>;
  accentColor: string;
}) {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  const rotateXVal = useSharedValue(0);
  const rotateYVal = useSharedValue(0);
  const translateYVal = useSharedValue(0);
  const buttonWidth = useSharedValue(48);
  const buttonHeight = useSharedValue(48);

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(expandProgress.value, [0.4, 1], [0, 1]),
      transform: [
        { translateY: interpolate(expandProgress.value, [0, 1], [-4, 0]) },
      ],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { translateY: translateYVal.value },
        { scale: scale.value },
        { rotateX: `${rotateXVal.value}deg` },
        { rotateY: `${rotateYVal.value}deg` },
      ],
    };
  });

  const updateTilt = (locX: number, locY: number, duration: number = 60) => {
    const w = buttonWidth.value || 48;
    const h = buttonHeight.value || 48;
    const normalizedX = Math.max(-1.2, Math.min(1.2, (locX / w) * 2 - 1));
    const normalizedY = Math.max(-1.2, Math.min(1.2, (locY / h) * 2 - 1));
    const maxRotate = 14;

    rotateXVal.value = withTiming(-normalizedY * maxRotate, { duration, easing: METRO_EASING });
    rotateYVal.value = withTiming(normalizedX * maxRotate, { duration, easing: METRO_EASING });
  };

  const handlePressIn = (e: any) => {
    setIsPressed(true);
    updateTilt(e.nativeEvent.locationX, e.nativeEvent.locationY, 100);
    scale.value = withTiming(0.92, { duration: 100, easing: METRO_EASING });
    translateYVal.value = withSpring(-2, { mass: 1, damping: 12, stiffness: 200 });
  };

  const handleTouchMove = (e: any) => {
    updateTilt(e.nativeEvent.locationX, e.nativeEvent.locationY, 50);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    rotateXVal.value = withTiming(0, { duration: 150, easing: METRO_EASING });
    rotateYVal.value = withTiming(0, { duration: 150, easing: METRO_EASING });
    scale.value = withTiming(1, { duration: 150, easing: METRO_EASING });
    translateYVal.value = withSpring(0, { mass: 1, damping: 12, stiffness: 200 });
  };

  const handleLayout = (e: any) => {
    buttonWidth.value = e.nativeEvent.layout.width;
    buttonHeight.value = e.nativeEvent.layout.height;
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onTouchMove={handleTouchMove}
      style={styles.btnContainer}
    >
      <Animated.View
        onLayout={handleLayout}
        style={[
          styles.circleIcon,
          animatedStyle,
          {
            borderColor: colors.white,
            backgroundColor: isPressed ? accentColor : 'transparent',
          },
        ]}
      >
        {children}
      </Animated.View>
      <Animated.Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[styles.label, labelStyle]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.menuItem}>
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1B1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    zIndex: 100,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    height: BAR_COLLAPSED_HEIGHT,
  },
  centerIcons: {
    flexDirection: 'row',
    gap: horizontalScale(16),
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'space-around',
  },
  dotsButton: {
    position: 'absolute',
    top: 10,
    width: 44,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    alignItems: 'center',
    width: horizontalScale(64),
    position: 'relative',
    height: 72,
  },
  circleIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: 49,
    left: -12,
    right: -12,
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(11),
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  menuList: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuItemText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(24),
    fontWeight: '300',
    color: colors.textPrimary,
    textTransform: 'lowercase',
  },
});
