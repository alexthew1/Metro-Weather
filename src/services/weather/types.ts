export type WeatherConditionCode =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'sleet'
  | 'wind'
  | 'haze'
  | 'unknown';

export interface WeatherLocation {
  id: string;
  cityName: string;
  region?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isCurrentLocation?: boolean;
}

export interface CurrentWeather {
  observedAt: string; // ISO string
  temperature: number; // Stored normalized in Celsius
  feelsLike: number;   // Stored normalized in Celsius
  isDay?: boolean;
  conditionCode: WeatherConditionCode;
  conditionText: string;
  humidityPercent: number;
  visibilityKm?: number;
  pressureHpa?: number;
  windSpeedKph: number;
  windDirectionDegrees?: number;
  windDirectionLabel?: string;
  precipitationProbability?: number;
  uvIndex?: number;
  todayHigh: number;
  todayLow: number;
  tonightHigh?: number;
  tonightLow?: number;
  todayConditionText?: string;
  tonightConditionText?: string;
}

export interface HourlyForecast {
  time: string; // ISO string or local time
  temperature: number; // Celsius
  feelsLike?: number;  // Celsius
  conditionCode: WeatherConditionCode;
  conditionText: string;
  precipitationProbability: number;
  humidityPercent?: number;
  windSpeedKph?: number;
  windDirectionLabel?: string;
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "FRI", "SAT"
  dateFormatted: string; // e.g. "23 FRI"
  high: number; // Celsius
  low: number;  // Celsius
  dayConditionCode: WeatherConditionCode;
  nightConditionCode?: WeatherConditionCode;
  conditionText: string;
  precipitationProbability: number;
  humidityPercent?: number;
  windSpeedKph?: number;
  windDirectionLabel?: string;
  sunrise?: string;
  sunset?: string;
  hourlyList?: HourlyForecast[];
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  description: string;
  issuedAt: string;
  expiresAt: string;
}

export interface RadarFrame {
  time: number;
  path: string;
  timestampFormatted: string;
}

export type TemperatureUnit = 'F' | 'C';
export type WindUnit = 'mph' | 'kmh' | 'knots' | 'ms';
export type PressureUnit = 'inHg' | 'hPa' | 'mb';
export type DistanceUnit = 'mi' | 'km';
export type ForecastProvider = 'auto' | 'icon' | 'jma' | 'gfs';
