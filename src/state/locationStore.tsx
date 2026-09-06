import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { WeatherLocation } from '../services/weather/types';

export interface LocationState {
  locations: WeatherLocation[];
  activeLocation: WeatherLocation;
  isLoadingLocation: boolean;
  addLocation: (loc: WeatherLocation) => void;
  removeLocation: (id: string) => void;
  setActiveLocation: (loc: WeatherLocation) => void;
  requestCurrentLocation: () => Promise<boolean>;
}

const DEFAULT_LOCATION: WeatherLocation = {
  id: 'phoenix-az',
  cityName: 'Phoenix',
  region: 'Arizona',
  country: 'United States',
  latitude: 33.4484,
  longitude: -112.0740,
  timezone: 'America/Phoenix',
};

const LOCATIONS_STORAGE_KEY = '@metro_weather_saved_locations';
const ACTIVE_LOC_STORAGE_KEY = '@metro_weather_active_location';

const LocationContext = createContext<LocationState | null>(null);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<WeatherLocation[]>([DEFAULT_LOCATION]);
  const [activeLocation, setActiveLocationState] = useState<WeatherLocation>(DEFAULT_LOCATION);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const savedLocs = await AsyncStorage.getItem(LOCATIONS_STORAGE_KEY);
        const savedActive = await AsyncStorage.getItem(ACTIVE_LOC_STORAGE_KEY);

        if (savedLocs) {
          const parsed = JSON.parse(savedLocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLocations(parsed);
          }
        }
        if (savedActive) {
          setActiveLocationState(JSON.parse(savedActive));
        }
      } catch (e) {
        console.warn('Failed to load locations from storage:', e);
      }
    })();
  }, []);

  const saveLocationsList = async (list: WeatherLocation[]) => {
    try {
      await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save locations list:', e);
    }
  };

  const addLocation = (loc: WeatherLocation) => {
    setLocations((prev) => {
      const exists = prev.some((l) => l.id === loc.id || (Math.abs(l.latitude - loc.latitude) < 0.05 && Math.abs(l.longitude - loc.longitude) < 0.05));
      if (exists) return prev;
      const updated = [...prev, loc];
      saveLocationsList(updated);
      return updated;
    });
    setActiveLocation(loc);
  };

  const removeLocation = (id: string) => {
    setLocations((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      const finalList = filtered.length > 0 ? filtered : [DEFAULT_LOCATION];
      saveLocationsList(finalList);
      if (activeLocation.id === id) {
        setActiveLocation(finalList[0]);
      }
      return finalList;
    });
  };

  const setActiveLocation = async (loc: WeatherLocation) => {
    setActiveLocationState(loc);
    try {
      await AsyncStorage.setItem(ACTIVE_LOC_STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      console.warn('Failed to save active location:', e);
    }
  };

  const requestCurrentLocation = async (): Promise<boolean> => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoadingLocation(false);
        return false;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const currentLoc: WeatherLocation = {
        id: 'current-gps-location',
        cityName: address?.city || address?.subregion || 'Current Location',
        region: address?.region || address?.district || '',
        country: address?.country || '',
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        isCurrentLocation: true,
      };

      addLocation(currentLoc);
      setActiveLocation(currentLoc);
      setIsLoadingLocation(false);
      return true;
    } catch (err) {
      console.warn('GPS location request failed:', err);
      setIsLoadingLocation(false);
      return false;
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        activeLocation,
        isLoadingLocation,
        addLocation,
        removeLocation,
        setActiveLocation,
        requestCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationState => {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return ctx;
};
