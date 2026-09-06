import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MetroPanoramaHeader } from '../../components/metro/MetroPanoramaHeader';
import { MetroTopBar } from '../../components/metro/MetroTopBar';
import { MetroAppBar } from '../../components/metro/MetroAppBar';
import { WeatherBackground } from '../../components/weather/WeatherBackground';
import { TodayScreen } from './TodayScreen';
import { DailyScreen } from './DailyScreen';
import { HourlyScreen } from './HourlyScreen';
import { MapsScreen } from './MapsScreen';
import { DayDetailPivotScreen } from './DayDetailPivotScreen';
import { LocationsScreen } from '../locations/LocationsScreen';
import { SearchLocationScreen } from '../locations/SearchLocationScreen';
import { SettingsScreen } from '../settings/SettingsScreen';
import { AboutModal } from '../about/AboutModal';
import { useLocation } from '../../state/locationStore';
import { useSettings } from '../../state/settingsStore';
import { useWeather } from '../../hooks/useWeather';
import { colors, getThemeColors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';

const PAGES = ['today', 'daily', 'hourly', 'maps'];
const METRO_EASING = Easing.bezier(0.1, 0.9, 0.2, 1);

export const WeatherPager: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const bgFillOpacity = useSharedValue(0);

  // Daily Detail Pivot Screen State
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Modals state
  const [showLocations, setShowLocations] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const { showTopBar, themeMode } = useSettings();
  const { activeLocation, requestCurrentLocation } = useLocation();
  const { data, loading, refreshing, refresh } = useWeather(activeLocation);

  // Determine whether Day or Night theme should be active
  const isDay =
    themeMode === 'day'
      ? true
      : themeMode === 'night'
        ? false
        : data?.current?.isDay !== undefined
          ? data.current.isDay
          : data?.current?.conditionCode
            ? !data.current.conditionCode.includes('night')
            : new Date().getHours() >= 6 && new Date().getHours() < 20;

  const themeColors = getThemeColors(isDay);

  // Fill up pivot header and background with solid theme color on screens other than 'today'
  useEffect(() => {
    bgFillOpacity.value = withTiming(currentPage === 0 ? 0 : 1, {
      duration: 250,
      easing: METRO_EASING,
    });
  }, [currentPage]);

  const animatedBgFillStyle = useAnimatedStyle(() => {
    return {
      opacity: bgFillOpacity.value,
    };
  });

  const handleSelectPage = (index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  // Hardware Back Button:
  // 1. Closes open DayDetailPivotScreen
  // 2. Closes any open modal/sheet
  // 3. Returns to the first page of the panorama (today)
  // 4. Default OS behavior (exit app) only if already on first page
  useEffect(() => {
    const onBackPress = () => {
      if (selectedDayIndex !== null) {
        setSelectedDayIndex(null);
        return true;
      }
      if (showAbout) {
        setShowAbout(false);
        return true;
      }
      if (showSettings) {
        setShowSettings(false);
        return true;
      }
      if (showSearch) {
        setShowSearch(false);
        return true;
      }
      if (showLocations) {
        setShowLocations(false);
        return true;
      }
      if (currentPage !== 0) {
        handleSelectPage(0);
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [
    selectedDayIndex,
    showAbout,
    showSettings,
    showSearch,
    showLocations,
    currentPage,
  ]);

  const locationDisplay = activeLocation.region
    ? `${activeLocation.cityName}, ${activeLocation.region}`.toUpperCase()
    : `${activeLocation.cityName}, ${activeLocation.country}`.toUpperCase();

  return (
    <WeatherBackground
      condition={data?.current?.conditionCode || 'partly-cloudy-day'}
      isDay={isDay}
    >
      {/* Background color fill layer that rises to fill the pivot header on screens other than today */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: themeColors.background },
          animatedBgFillStyle,
        ]}
      />

      <View style={styles.container}>
        {/* Optional Windows Phone Accent Top Bar */}
        <MetroTopBar title="Metro Weather" />

        {/* Location Heading (Above Panorama Pivot Header) - Safe area aware when top bar hidden */}
        <View
          style={[
            styles.locationContainer,
            {
              paddingLeft: horizontalScale(18) + insets.left,
              paddingRight: horizontalScale(18) + insets.right,
            },
            !showTopBar && { paddingTop: Math.max(insets.top, 12) },
          ]}
        >
          <Text style={styles.locationText}>{locationDisplay}</Text>
        </View>

        {/* Panorama Navigation Header - Slides with active tab */}
        <MetroPanoramaHeader
          activeIndex={currentPage}
          onSelectIndex={handleSelectPage}
          pages={PAGES}
        />

        {/* Main Content Area */}
        {loading && !data ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.textPrimary} />
            <Text style={styles.loadingText}>updating weather...</Text>
          </View>
        ) : data ? (
          <PagerView
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={handlePageSelected}
            offscreenPageLimit={3}
          >
            {/* 1. Today Page */}
            <View key="today" style={styles.page}>
              <TodayScreen
                current={data.current}
                location={activeLocation}
                refreshing={refreshing}
                onRefresh={refresh}
              />
            </View>

            {/* 2. Daily Forecast Page */}
            <View key="daily" style={styles.page}>
              <DailyScreen
                dailyList={data.daily}
                onSelectDay={(idx) => setSelectedDayIndex(idx)}
              />
            </View>

            {/* 3. Hourly Forecast Page */}
            <View key="hourly" style={styles.page}>
              <HourlyScreen hourlyList={data.hourly} />
            </View>

            {/* 4. Weather Radar / Maps Page */}
            <View key="maps" style={styles.page}>
              <MapsScreen location={activeLocation} />
            </View>
          </PagerView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>can't update weather right now</Text>
          </View>
        )}

        {/* Persistent Bottom Metro Application Bar */}
        <MetroAppBar
          onLocationsPress={() => setShowLocations(true)}
          onSearchPress={() => setShowSearch(true)}
          onCurrentLocationPress={async () => {
            await requestCurrentLocation();
            refresh();
          }}
          onRefreshPress={refresh}
          onSettingsPress={() => setShowSettings(true)}
          onAboutPress={() => setShowAbout(true)}
        />

        {/* Day Detail Pivot Screen (Opens when clicking any daily item) */}
        {selectedDayIndex !== null && data && (
          <DayDetailPivotScreen
            dailyList={data.daily}
            initialIndex={selectedDayIndex}
            location={activeLocation}
            hourlyList={data.hourly}
            isDay={isDay}
            onClose={() => setSelectedDayIndex(null)}
          />
        )}

        {/* Sheets / Modals */}
        <LocationsScreen
          visible={showLocations}
          onClose={() => setShowLocations(false)}
          onOpenSearch={() => setShowSearch(true)}
        />
        <SearchLocationScreen
          visible={showSearch}
          onClose={() => setShowSearch(false)}
        />
        <SettingsScreen
          visible={showSettings}
          onClose={() => setShowSettings(false)}
        />
        <AboutModal
          visible={showAbout}
          onClose={() => setShowAbout(false)}
        />
      </View>
    </WeatherBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  locationContainer: {
    paddingHorizontal: horizontalScale(18),
    marginTop: 6,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  locationText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(18),
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  pagerView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  page: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  loadingText: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(18),
    color: colors.textSecondary,
    marginTop: 16,
    textTransform: 'lowercase',
  },
});
