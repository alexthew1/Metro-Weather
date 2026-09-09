import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherLocation } from './types';
import { WeatherDataBundle, WeatherProvider } from './WeatherProvider';
import { OpenMeteoAdapter } from './providerAdapters/OpenMeteoAdapter';
import { MockWeatherAdapter } from './providerAdapters/MockWeatherAdapter';

const CACHE_PREFIX = '@metro_weather_cache_';
const FRESHNESS_MS = 15 * 60 * 1000; // 15 minutes

export class WeatherRepository {
  private primaryProvider: WeatherProvider;
  private mockProvider: WeatherProvider;

  constructor() {
    this.primaryProvider = new OpenMeteoAdapter();
    this.mockProvider = new MockWeatherAdapter();
  }

  async getWeatherData(location: WeatherLocation, forceRefresh = false, model = 'auto'): Promise<{ data: WeatherDataBundle; isStale: boolean }> {
    const cacheKey = `${CACHE_PREFIX}${location.id}_${model}`;

    // 1. Check cache first if not forcing refresh
    if (!forceRefresh) {
      try {
        const cachedRaw = await AsyncStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cachedData: WeatherDataBundle = JSON.parse(cachedRaw);
          const age = Date.now() - new Date(cachedData.fetchedAt).getTime();
          if (age < FRESHNESS_MS) {
            return { data: cachedData, isStale: false };
          }
        }
      } catch (e) {
        console.warn('Cache read error:', e);
      }
    }

    // 2. Fetch fresh data
    try {
      const freshData = await this.primaryProvider.getWeatherData(location, model);

      // Save to cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify(freshData));
      return { data: freshData, isStale: false };
    } catch (fetchError) {
      console.warn('Fresh fetch failed, falling back to cache or mock:', fetchError);

      // Fallback to cache if available
      try {
        const cachedRaw = await AsyncStorage.getItem(cacheKey);
        if (cachedRaw) {
          return { data: JSON.parse(cachedRaw), isStale: true };
        }
      } catch {}

      // Ultimate fallback: mock adapter
      const fallbackMock = await this.mockProvider.getWeatherData(location);
      return { data: fallbackMock, isStale: true };
    }
  }

  async searchLocations(query: string): Promise<WeatherLocation[]> {
    try {
      const results = await this.primaryProvider.searchLocations(query);
      if (results.length > 0) return results;
    } catch {}
    return this.mockProvider.searchLocations(query);
  }
}

export const weatherRepository = new WeatherRepository();
