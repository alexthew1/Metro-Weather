import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TemperatureUnit, WindUnit, PressureUnit, DistanceUnit } from '../services/weather/types';
import { colors } from '../theme/tokens';

export interface SettingsState {
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  distanceUnit: DistanceUnit;
  accentColor: string;
  showTopBar: boolean;
  useImageryBackground: boolean;
  forecastProvider: 'auto' | 'icon' | 'jma' | 'gfs';
  themeMode: 'auto' | 'day' | 'night';
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindUnit) => void;
  setPressureUnit: (unit: PressureUnit) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setAccentColor: (color: string) => void;
  setShowTopBar: (show: boolean) => void;
  setUseImageryBackground: (use: boolean) => void;
  setForecastProvider: (provider: 'auto' | 'icon' | 'jma' | 'gfs') => void;
  setThemeMode: (mode: 'auto' | 'day' | 'night') => void;
}

const SETTINGS_STORAGE_KEY = '@metro_weather_settings';

const defaultSettings = {
  temperatureUnit: 'F' as TemperatureUnit,
  windUnit: 'mph' as WindUnit,
  pressureUnit: 'inHg' as PressureUnit,
  distanceUnit: 'mi' as DistanceUnit,
  accentColor: colors.accent,
  showTopBar: true,
  useImageryBackground: true,
  forecastProvider: 'auto' as 'auto' | 'icon' | 'jma' | 'gfs',
  themeMode: 'auto' as 'auto' | 'day' | 'night',
};

const SettingsContext = createContext<SettingsState | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [temperatureUnit, setTemperatureUnitState] = useState<TemperatureUnit>(defaultSettings.temperatureUnit);
  const [windUnit, setWindUnitState] = useState<WindUnit>(defaultSettings.windUnit);
  const [pressureUnit, setPressureUnitState] = useState<PressureUnit>(defaultSettings.pressureUnit);
  const [distanceUnit, setDistanceUnitState] = useState<DistanceUnit>(defaultSettings.distanceUnit);
  const [accentColor, setAccentColorState] = useState<string>(defaultSettings.accentColor);
  const [showTopBar, setShowTopBarState] = useState<boolean>(defaultSettings.showTopBar);
  const [useImageryBackground, setUseImageryBackgroundState] = useState<boolean>(defaultSettings.useImageryBackground);
  const [forecastProvider, setForecastProviderState] = useState<'auto' | 'icon' | 'jma' | 'gfs'>(defaultSettings.forecastProvider);
  const [themeMode, setThemeModeState] = useState<'auto' | 'day' | 'night'>(defaultSettings.themeMode);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.temperatureUnit) setTemperatureUnitState(parsed.temperatureUnit);
          if (parsed.windUnit) setWindUnitState(parsed.windUnit);
          if (parsed.pressureUnit) setPressureUnitState(parsed.pressureUnit);
          if (parsed.distanceUnit) setDistanceUnitState(parsed.distanceUnit);
          if (parsed.accentColor) setAccentColorState(parsed.accentColor);
          if (parsed.showTopBar !== undefined) setShowTopBarState(parsed.showTopBar);
          if (parsed.useImageryBackground !== undefined) setUseImageryBackgroundState(parsed.useImageryBackground);
          if (parsed.themeMode) setThemeModeState(parsed.themeMode);
          if (parsed.forecastProvider && parsed.forecastProvider !== 'owm') {
            setForecastProviderState(parsed.forecastProvider);
          }
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    })();
  }, []);

  const saveSettings = async (updates: any) => {
    try {
      const current = {
        temperatureUnit,
        windUnit,
        pressureUnit,
        distanceUnit,
        accentColor,
        showTopBar,
        useImageryBackground,
        forecastProvider,
        themeMode,
        ...updates,
      };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  };

  const setTemperatureUnit = (unit: TemperatureUnit) => {
    setTemperatureUnitState(unit);
    saveSettings({ temperatureUnit: unit });
  };

  const setWindUnit = (unit: WindUnit) => {
    setWindUnitState(unit);
    saveSettings({ windUnit: unit });
  };

  const setPressureUnit = (unit: PressureUnit) => {
    setPressureUnitState(unit);
    saveSettings({ pressureUnit: unit });
  };

  const setDistanceUnit = (unit: DistanceUnit) => {
    setDistanceUnitState(unit);
    saveSettings({ distanceUnit: unit });
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    saveSettings({ accentColor: color });
  };

  const setShowTopBar = (show: boolean) => {
    setShowTopBarState(show);
    saveSettings({ showTopBar: show });
  };

  const setUseImageryBackground = (use: boolean) => {
    setUseImageryBackgroundState(use);
    saveSettings({ useImageryBackground: use });
  };

  const setForecastProvider = (provider: 'auto' | 'icon' | 'jma' | 'gfs') => {
    setForecastProviderState(provider);
    saveSettings({ forecastProvider: provider });
  };

  const setThemeMode = (mode: 'auto' | 'day' | 'night') => {
    setThemeModeState(mode);
    saveSettings({ themeMode: mode });
  };

  return (
    <SettingsContext.Provider
      value={{
        temperatureUnit,
        windUnit,
        pressureUnit,
        distanceUnit,
        accentColor,
        showTopBar,
        useImageryBackground,
        forecastProvider,
        themeMode,
        setTemperatureUnit,
        setWindUnit,
        setPressureUnit,
        setDistanceUnit,
        setAccentColor,
        setShowTopBar,
        setUseImageryBackground,
        setForecastProvider,
        setThemeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsState => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
