import { WeatherLocation, CurrentWeather, HourlyForecast, DailyForecast, WeatherAlert } from './types';

export interface WeatherDataBundle {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
  fetchedAt: string;
}

export interface WeatherProvider {
  searchLocations(query: string): Promise<WeatherLocation[]>;
  getWeatherData(location: WeatherLocation, model?: string): Promise<WeatherDataBundle>;
}
