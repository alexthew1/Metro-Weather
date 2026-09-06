import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  LayoutChangeEvent,
  Modal,
  Dimensions,
} from 'react-native';
import MapView, { UrlTile, WMSTile, Marker } from 'react-native-maps';
import { Ionicons, Feather } from '@expo/vector-icons';
import { WeatherLocation } from '../../services/weather/types';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../../state/settingsStore';

interface MapsScreenProps {
  location: WeatherLocation;
}

interface RadarForecastFrame {
  time: number;
  urlTemplate: string;
  label: string;
}

type MapLayerType = 'radar' | 'satellite_radar' | 'temperature';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 8 NOAA HRRR forecast intervals: Now up to +2 hours
const HRRR_FORECAST_INTERVALS = [0, 15, 30, 45, 60, 75, 90, 120];

export const MapsScreen: React.FC<MapsScreenProps> = ({ location }) => {
  const insets = useSafeAreaInsets();
  const { accentColor, temperatureUnit } = useSettings();

  const [mapType, setMapType] = useState<MapLayerType>('radar');
  const [showPicker, setShowPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [forecastFrames, setForecastFrames] = useState<RadarForecastFrame[]>([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [trackWidth, setTrackWidth] = useState(SCREEN_WIDTH - 84);

  const trackLayoutRef = useRef<{ x: number; width: number }>({ x: 0, width: SCREEN_WIDTH - 84 });
  const trackRef = useRef<View>(null);
  const playTimeoutRef = useRef<any>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentIdxRef = useRef(currentFrameIdx);
  currentIdxRef.current = currentFrameIdx;

  const framesRef = useRef<RadarForecastFrame[]>([]);
  framesRef.current = forecastFrames;

  const isRadarMode = mapType === 'radar' || mapType === 'satellite_radar';

  const isNorthAmerica = useMemo(() => {
    return (
      location.longitude >= -170 &&
      location.longitude <= -50 &&
      location.latitude >= 15 &&
      location.latitude <= 75
    );
  }, [location.longitude, location.latitude]);

  // 1. Generate real NOAA HRRR predictive forecast frames for North America,
  // or fetch real-time RainViewer global radar for Europe, Asia & international regions
  useEffect(() => {
    let isMounted = true;
    const nowSec = Math.floor(Date.now() / 1000);

    if (isNorthAmerica) {
      const generated: RadarForecastFrame[] = HRRR_FORECAST_INTERVALS.map((mins) => {
        const padMin = String(mins).padStart(4, '0');
        const timeSec = nowSec + mins * 60;
        const label =
          mins === 0
            ? 'Now'
            : mins < 60
              ? `+${mins}m`
              : `+${Math.floor(mins / 60)}h ${mins % 60 ? `${mins % 60}m` : ''}`.trim();
        return {
          time: timeSec,
          urlTemplate: `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/hrrr::REFD-F${padMin}-0/{z}/{x}/{y}.png`,
          label,
        };
      });
      setForecastFrames(generated);
      setCurrentFrameIdx(0);
    } else {
      // Global radar coverage for Europe, Asia, Australia, Americas
      (async () => {
        try {
          const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
          if (!res.ok) throw new Error('Failed to fetch global radar');
          const data = await res.json();
          const pastRaw = data.radar?.past || [];
          if (isMounted && pastRaw.length > 0) {
            const sliced = pastRaw.slice(-8);
            const parsed: RadarForecastFrame[] = sliced.map((f: any) => {
              const minsAgo = Math.max(0, Math.round((nowSec - f.time) / 60));
              return {
                time: f.time,
                urlTemplate: `https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
                label: minsAgo <= 3 ? 'Now' : `-${minsAgo}m`,
              };
            });
            setForecastFrames(parsed);
            setCurrentFrameIdx(0);
          }
        } catch (err) {
          console.warn('Global radar fetch error, using fallback:', err);
          if (isMounted) {
            const fallback: RadarForecastFrame[] = Array.from({ length: 6 }, (_, i) => ({
              time: nowSec - (5 - i) * 600,
              urlTemplate: '',
              label: i === 5 ? 'Now' : `-${(5 - i) * 10}m`,
            }));
            setForecastFrames(fallback);
          }
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [location.id, location.latitude, location.longitude, isNorthAmerica]);

  // 2. Playback loop: loops through forecast frames
  // Dwells for 4 seconds (4000ms) on each frame, with a 5000ms pause on the final frame
  useEffect(() => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    if (!isPlaying || !isRadarMode || forecastFrames.length <= 1) return;

    const scheduleNextFrame = () => {
      const total = framesRef.current.length;
      if (!total) return;

      const current = currentIdxRef.current;
      const isLatest = current === total - 1;

      // Stay on each frame for 4 seconds, linger 5s on final frame before looping
      const dwellMs = isLatest ? 5000 : 4000;

      playTimeoutRef.current = setTimeout(() => {
        if (!isPlayingRef.current) return;
        const nextIdx = (currentIdxRef.current + 1) % framesRef.current.length;
        setCurrentFrameIdx(nextIdx);
        scheduleNextFrame();
      }, dwellMs);
    };

    scheduleNextFrame();

    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, [isPlaying, mapType, forecastFrames.length]);

  // Formatted date and time for active forecast frame or current observation
  const { timeString, dateString, frameLabel } = useMemo(() => {
    const d =
      mapType === 'radar' && forecastFrames[currentFrameIdx]
        ? new Date(forecastFrames[currentFrameIdx].time * 1000)
        : new Date();

    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dayLabel = days[d.getDay()];
    const monthLabel = months[d.getMonth()];
    const dateNum = d.getDate();

    const label =
      mapType === 'radar' && forecastFrames[currentFrameIdx]
        ? forecastFrames[currentFrameIdx].label
        : 'Live';

    return {
      timeString: `${hours}:${minStr} ${ampm}`,
      dateString: `${dayLabel}, ${monthLabel} ${dateNum}`,
      frameLabel: label,
    };
  }, [mapType, forecastFrames, currentFrameIdx]);

  // Measure scrubber layout precisely relative to window
  const measureTrack = () => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      if (width > 0) {
        trackLayoutRef.current = { x, width };
        setTrackWidth(width);
      }
    });
  };

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setTrackWidth(width);
    measureTrack();
  };

  // Update scrubber frame from page coordinate
  const seekToX = (pageX: number) => {
    if (!forecastFrames.length) return;
    const { x, width } = trackLayoutRef.current;
    const safeWidth = width > 0 ? width : trackWidth;
    const relativeX = Math.max(0, Math.min(pageX - x, safeWidth));
    const ratio = safeWidth > 0 ? relativeX / safeWidth : 0;
    const index = Math.min(
      Math.floor(ratio * forecastFrames.length),
      forecastFrames.length - 1
    );
    setCurrentFrameIdx(Math.max(0, index));
  };

  // Smooth PanResponder for immediate skimming through the timeline
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt) => {
          setIsPlaying(false);
          measureTrack();
          seekToX(evt.nativeEvent.pageX);
        },
        onPanResponderMove: (evt) => {
          seekToX(evt.nativeEvent.pageX);
        },
        onPanResponderRelease: (evt) => {
          seekToX(evt.nativeEvent.pageX);
        },
      }),
    [forecastFrames.length, trackWidth]
  );

  const activeProgress =
    forecastFrames.length > 1
      ? currentFrameIdx / (forecastFrames.length - 1)
      : 0;

  const currentFrame = forecastFrames[currentFrameIdx];

  const togglePlay = () => {
    if (!isPlaying) {
      if (currentFrameIdx >= forecastFrames.length - 1) {
        setCurrentFrameIdx(0);
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingLeft: Math.max(insets.left, horizontalScale(16)),
          paddingRight: Math.max(insets.right, horizontalScale(16)),
          paddingBottom: 68 + insets.bottom + 8,
        },
      ]}
    >
      {/* 1. Choose Map Selector Bar (Matching Bing Weather screenshot) */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorLabel}>Choose map</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowPicker(true)}
          style={styles.dropdownButton}
        >
          <Text style={styles.dropdownText}>
            {mapType === 'radar'
              ? 'Radar'
              : mapType === 'satellite_radar'
                ? 'Satellite Radar'
                : 'Temperature'}
          </Text>
          <Feather name="chevron-down" size={18} color="#1C1B1A" />
        </TouchableOpacity>
      </View>

      {/* 2. Embedded Metro Map Window */}
      <View style={styles.mapWindow}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 4.5,
            longitudeDelta: 4.5,
          }}
          minZoomLevel={2}
          maxZoomLevel={7.8}
          mapType={mapType === 'satellite_radar' ? 'hybrid' : 'standard'}
          showsCompass={false}
          showsScale={false}
          showsBuildings={false}
          showsPointsOfInterest={false}
        >
          {/* 1. Radar Layer: High-resolution simulated reflectivity or global precipitation radar */}
          {isRadarMode && currentFrame && currentFrame.urlTemplate ? (
            <UrlTile
              key={`radar-${currentFrame.time}-${currentFrameIdx}-${mapType}`}
              urlTemplate={currentFrame.urlTemplate}
              zIndex={10}
              opacity={mapType === 'satellite_radar' ? 0.88 : 0.82}
              maximumZ={9}
            />
          ) : null}

          {/* 2. Temperature Layer: Global GDPS Surface Temperature 2m (Covers the entire globe) */}
          {mapType === 'temperature' ? (
            <WMSTile
              key="global-gdps-temperature"
              urlTemplate="https://geo.weather.gc.ca/geomet?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=GDPS_15km_AirTemp_2m&STYLES=TEMPERATURE-LINEAR&SRS=EPSG:3857&BBOX={minX},{minY},{maxX},{maxY}&WIDTH={width}&HEIGHT={height}&FORMAT=image/png&TRANSPARENT=TRUE"
              zIndex={10}
              opacity={0.65}
              tileSize={256}
            />
          ) : null}

          {/* Location Marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.cityName}
          />
        </MapView>

        {/* Floating Play / Pause circular button in upper-right corner of map (Active on Radar forecast) */}
        {isRadarMode && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={togglePlay}
            style={[
              styles.floatingPlayBtn,
              isPlaying && { backgroundColor: accentColor, borderColor: accentColor },
            ]}
            accessibilityLabel={
              isPlaying ? 'Pause forecast radar animation' : 'Play forecast radar animation'
            }
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={22}
              color={colors.white}
              style={{ marginLeft: isPlaying ? 0 : 2 }}
            />
          </TouchableOpacity>
        )}

        {/* Floating Bottom HUD: Timestamp + Intensity / Temperature Scale */}
        <View style={styles.mapHudOverlay}>
          <View style={styles.timeGroup}>
            <View style={styles.timeRow}>
              <Text style={styles.hudTime}>{timeString}</Text>
              {isRadarMode ? (
                <View style={isNorthAmerica ? styles.forecastBadge : styles.liveBadge}>
                  <Text style={isNorthAmerica ? styles.forecastBadgeText : styles.liveBadgeText}>
                    {isNorthAmerica
                      ? `FORECAST ${frameLabel !== 'Now' ? `(${frameLabel})` : ''}`
                      : `RADAR ${frameLabel !== 'Now' ? `(${frameLabel})` : 'LIVE'}`}
                  </Text>
                </View>
              ) : (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              )}
            </View>
            <Text style={styles.hudDate}>{dateString}</Text>
          </View>

          {/* Intensity / Temperature Scale Bar matching reference */}
          {mapType === 'temperature' ? (
            <View style={styles.scaleContainer}>
              <View style={styles.scaleColorBar}>
                <View style={[styles.scaleSegment, { backgroundColor: '#283593' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#1565C0' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#0288D1' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#00ACC1' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#00BFA5' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#43A047' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#8BC34A' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#FDD835' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#FB8C00' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#F4511E' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#E53935' }]} />
              </View>
              <View style={styles.scaleLabelsRow}>
                {temperatureUnit === 'F' ? (
                  <>
                    <Text style={styles.scaleNum}>-20</Text>
                    <Text style={styles.scaleNum}>0</Text>
                    <Text style={styles.scaleNum}>20</Text>
                    <Text style={styles.scaleNum}>40</Text>
                    <Text style={styles.scaleNum}>60</Text>
                    <Text style={styles.scaleNum}>80</Text>
                    <Text style={styles.scaleNum}>100</Text>
                    <Text style={styles.scaleNum}>120 °F</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.scaleNum}>-30</Text>
                    <Text style={styles.scaleNum}>-20</Text>
                    <Text style={styles.scaleNum}>-10</Text>
                    <Text style={styles.scaleNum}>0</Text>
                    <Text style={styles.scaleNum}>10</Text>
                    <Text style={styles.scaleNum}>20</Text>
                    <Text style={styles.scaleNum}>30</Text>
                    <Text style={styles.scaleNum}>40</Text>
                    <Text style={styles.scaleNum}>50 °C</Text>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.scaleContainer}>
              <View style={styles.scaleColorBar}>
                <View style={[styles.scaleSegment, { backgroundColor: '#4FC3F7' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#00E676' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#76FF03' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#FFEA00' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#FF9100' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#FF1744' }]} />
                <View style={[styles.scaleSegment, { backgroundColor: '#D500F9' }]} />
              </View>
              <View style={styles.scaleLabelsRow}>
                <Text style={styles.scaleNum}>Light</Text>
                <Text style={styles.scaleNum}>Moderate</Text>
                <Text style={styles.scaleNum}>Heavy</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 3. Interactive Fluid Timeline Scrubber Bar (for Forecast Radar & Satellite Radar) */}
      {isRadarMode ? (
        <View style={styles.scrubberSection}>
          <View
            ref={trackRef}
            {...panResponder.panHandlers}
            onLayout={onTrackLayout}
            style={styles.scrubberTouchArea}
          >
            {/* Base rail */}
            <View style={styles.scrubberRail}>
              {/* Active filled track */}
              <View
                style={[
                  styles.scrubberFill,
                  {
                    width: `${activeProgress * 100}%`,
                    backgroundColor: '#00D2FF',
                  },
                ]}
              />
            </View>

            {/* Tick marks for each radar forecast frame */}
            <View style={styles.ticksContainer} pointerEvents="none">
              {forecastFrames.map((frame, idx) => {
                const pos =
                  forecastFrames.length > 1
                    ? idx / (forecastFrames.length - 1)
                    : 0;
                const isPassed = idx <= currentFrameIdx;
                const isLive = idx === 0;

                return (
                  <View
                    key={`tick-${frame.time}-${idx}`}
                    style={[
                      styles.tickMark,
                      {
                        left: `${pos * 100}%`,
                        backgroundColor: isLive
                          ? '#4CAF50'
                          : isPassed
                            ? '#00D2FF'
                            : 'rgba(0, 210, 255, 0.45)',
                        height: isLive ? 12 : 6,
                        top: isLive ? -3 : 0,
                        width: isLive ? 3 : 2,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Metro Draggable Thumb */}
            <View
              pointerEvents="none"
              style={[
                styles.scrubberThumb,
                {
                  left: Math.max(
                    0,
                    Math.min(activeProgress * trackWidth - 10, trackWidth - 20)
                  ),
                  borderColor: colors.white,
                  backgroundColor: '#00D2FF',
                },
              ]}
            />
          </View>

          {/* Timeline bounds */}
          <View style={styles.timelineBounds}>
            <Text style={styles.boundText}>{isNorthAmerica ? 'Now' : '-1 hr'}</Text>
            <Text style={styles.boundStatusText}>
              {isPlaying
                ? (isNorthAmerica ? 'PLAYING FORECAST' : 'PLAYING RADAR')
                : (isNorthAmerica
                    ? (currentFrameIdx === 0 ? 'CURRENT (NOW)' : `PREDICTIVE FORECAST (${frameLabel})`)
                    : (currentFrameIdx === forecastFrames.length - 1 ? 'CURRENT (LIVE)' : `OBSERVED RADAR (${frameLabel})`))}
            </Text>
            <Text style={[styles.boundText, { color: isNorthAmerica ? '#00D2FF' : colors.textDim }]}>
              {isNorthAmerica ? '+2 hr' : 'Now'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.liveObservationBar}>
          <View style={styles.liveIndicatorDot} />
          <Text style={styles.liveObservationText}>
            LIVE {mapType.toUpperCase()} OBSERVATION • REAL-TIME
          </Text>
        </View>
      )}

      {/* Choose Map Modal / Flyout */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose map</Text>
            {[
              { type: 'radar', label: 'Radar' },
              { type: 'satellite_radar', label: 'Satellite Radar' },
              { type: 'temperature', label: 'Temperature' },
            ].map((option) => {
              const isSelected = mapType === option.type;

              return (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.modalOption,
                    isSelected && { backgroundColor: accentColor },
                  ]}
                  onPress={() => {
                    setMapType(option.type as MapLayerType);
                    setShowPicker(false);
                    if (option.type === 'temperature') {
                      setIsPlaying(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={20} color={colors.white} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  selectorSection: {
    marginBottom: 6,
    marginTop: 2,
  },
  selectorLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    color: colors.textPrimary,
    marginBottom: 6,
  },
  dropdownButton: {
    backgroundColor: '#D1D2D4',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#B0B5B9',
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(17),
    color: '#1C1B1A',
  },
  mapWindow: {
    flex: 1,
    minHeight: 220,
    backgroundColor: '#E6E3DF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 0,
    marginBottom: 8,
  },
  floatingPlayBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: 'rgba(30, 26, 23, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  mapHudOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(25, 22, 20, 0.88)',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
    zIndex: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeGroup: {
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hudTime: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(22),
    fontWeight: '300',
    color: colors.white,
    lineHeight: normalizeFont(26),
  },
  liveBadge: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 0,
  },
  liveBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: normalizeFont(10),
    color: '#4CAF50',
    letterSpacing: 0.8,
  },
  forecastBadge: {
    borderWidth: 1,
    borderColor: '#00D2FF',
    backgroundColor: 'rgba(0, 210, 255, 0.18)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 0,
  },
  forecastBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: normalizeFont(10),
    color: '#00D2FF',
    letterSpacing: 0.8,
  },
  hudDate: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(11),
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  scaleContainer: {
    marginTop: 2,
  },
  scaleColorBar: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
    marginBottom: 2,
  },
  scaleSegment: {
    flex: 1,
    height: '100%',
  },
  scaleLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  scaleNum: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(9),
    color: 'rgba(255, 255, 255, 0.75)',
  },
  scrubberSection: {
    paddingVertical: 4,
    marginBottom: 0,
  },
  scrubberTouchArea: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  scrubberRail: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  scrubberFill: {
    height: '100%',
  },
  ticksContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 17,
    height: 6,
  },
  tickMark: {
    position: 'absolute',
    width: 2,
    height: 6,
    marginLeft: -1,
  },
  scrubberThumb: {
    position: 'absolute',
    width: 20,
    height: 24,
    borderWidth: 2,
    top: 8,
    borderRadius: 0,
  },
  timelineBounds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  boundText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(11),
    color: colors.textDim,
  },
  boundStatusText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(10),
    color: colors.textDim,
    letterSpacing: 0.8,
  },
  liveObservationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  liveObservationText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(11),
    color: colors.textDim,
    letterSpacing: 0.8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#211D1A',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 16,
  },
  modalTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(18),
    color: colors.textPrimary,
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  modalOptionText: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(16),
    color: colors.textPrimary,
  },
  modalOptionActive: {
    fontWeight: '700',
    color: colors.white,
  },
});
