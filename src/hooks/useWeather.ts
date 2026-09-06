import { useState, useEffect, useCallback } from 'react';
import { WeatherLocation } from '../services/weather/types';
import { WeatherDataBundle } from '../services/weather/WeatherProvider';
import { weatherRepository } from '../services/weather/weatherRepository';
import { useSettings } from '../state/settingsStore';

export function useWeather(location: WeatherLocation) {
  const { forecastProvider } = useSettings();
  const [data, setData] = useState<WeatherDataBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await weatherRepository.getWeatherData(location, forceRefresh, forecastProvider);
      setData(result.data);
      setIsStale(result.isStale);
    } catch (e: any) {
      setError(e.message || 'Unable to update weather');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location.id, location.latitude, location.longitude, forecastProvider]);

  useEffect(() => {
    fetchWeather(false);
  }, [fetchWeather]);

  const refresh = () => fetchWeather(true);

  return {
    data,
    loading,
    refreshing,
    isStale,
    error,
    refresh,
  };
}
