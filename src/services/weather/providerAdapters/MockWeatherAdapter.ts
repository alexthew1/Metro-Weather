import { WeatherProvider, WeatherDataBundle } from '../WeatherProvider';
import { WeatherLocation, CurrentWeather, HourlyForecast, DailyForecast } from '../types';

export class MockWeatherAdapter implements WeatherProvider {
  async searchLocations(query: string): Promise<WeatherLocation[]> {
    const list: WeatherLocation[] = [
      {
        id: 'phoenix-az',
        cityName: 'Phoenix',
        region: 'Arizona',
        country: 'United States',
        latitude: 33.4484,
        longitude: -112.074,
        timezone: 'America/Phoenix',
      },
      {
        id: 'seattle-wa',
        cityName: 'Seattle',
        region: 'Washington',
        country: 'United States',
        latitude: 47.6062,
        longitude: -122.3321,
        timezone: 'America/Los_Angeles',
      },
      {
        id: 'newyork-ny',
        cityName: 'New York',
        region: 'New York',
        country: 'United States',
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
      },
      {
        id: 'london-uk',
        cityName: 'London',
        region: 'England',
        country: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
      },
      {
        id: 'tokyo-jp',
        cityName: 'Tokyo',
        region: 'Tokyo',
        country: 'Japan',
        latitude: 35.6762,
        longitude: 139.6503,
        timezone: 'Asia/Tokyo',
      }
    ];

    if (!query.trim()) return list;
    return list.filter(l => 
      l.cityName.toLowerCase().includes(query.toLowerCase()) || 
      (l.region && l.region.toLowerCase().includes(query.toLowerCase()))
    );
  }

  async getWeatherData(location: WeatherLocation, model?: string): Promise<WeatherDataBundle> {
    // 104°F = 40°C, 105°F = 40.5°C, 85°F = 29.4°C
    const current: CurrentWeather = {
      observedAt: new Date().toISOString(),
      temperature: 40.0, // 104°F
      feelsLike: 40.0,
      conditionCode: 'partly-cloudy-day',
      conditionText: 'Mostly Cloudy',
      humidityPercent: 20,
      visibilityKm: 16.1, // 10 mi
      pressureHpa: 1007, // ~29.74 inHg
      windSpeedKph: 12.9, // 8 mph
      windDirectionDegrees: 202,
      windDirectionLabel: 'SSW',
      precipitationProbability: 20,
      uvIndex: 9,
      todayHigh: 40.6, // 105°F
      todayLow: 29.4,  // 85°F
      tonightHigh: 33.0,
      tonightLow: 29.4,
      todayConditionText: 'Sunny',
      tonightConditionText: 'Mostly Clear',
    };

    const hourly: HourlyForecast[] = [
      { time: '3:00 PM', temperature: 40.0, conditionCode: 'partly-cloudy-day', conditionText: 'Partly Cloudy', precipitationProbability: 20, windSpeedKph: 12.9, humidityPercent: 20 },
      { time: '4:00 PM', temperature: 40.6, conditionCode: 'partly-cloudy-day', conditionText: 'Partly Cloudy', precipitationProbability: 20, windSpeedKph: 14.0, humidityPercent: 19 },
      { time: '5:00 PM', temperature: 40.0, conditionCode: 'clear-day', conditionText: 'Mostly Sunny', precipitationProbability: 10, windSpeedKph: 12.0, humidityPercent: 21 },
      { time: '6:00 PM', temperature: 38.9, conditionCode: 'clear-day', conditionText: 'Sunny', precipitationProbability: 10, windSpeedKph: 11.0, humidityPercent: 24 },
      { time: '7:00 PM', temperature: 36.7, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 9.0, humidityPercent: 28 },
      { time: '8:00 PM', temperature: 34.4, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 8.0, humidityPercent: 32 },
      { time: '9:00 PM', temperature: 32.8, conditionCode: 'clear-night', conditionText: 'Mostly Clear', precipitationProbability: 10, windSpeedKph: 8.0, humidityPercent: 35 },
      { time: '10:00 PM', temperature: 31.7, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 7.0, humidityPercent: 38 },
      { time: '11:00 PM', temperature: 30.6, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 6.0, humidityPercent: 40 },
      { time: '12:00 AM', temperature: 30.0, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 6.0, humidityPercent: 42 },
      { time: '1:00 AM', temperature: 29.4, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 5.0, humidityPercent: 45 },
      { time: '2:00 AM', temperature: 28.9, conditionCode: 'clear-night', conditionText: 'Clear', precipitationProbability: 10, windSpeedKph: 5.0, humidityPercent: 48 },
    ];

    const days = ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const daily: DailyForecast[] = [
      {
        date: '2026-09-04',
        dayLabel: 'FRI',
        dateFormatted: '23 FRI',
        high: 40.6, // 105°
        low: 29.4,  // 85°
        dayConditionCode: 'clear-day',
        nightConditionCode: 'clear-night',
        conditionText: 'Sunny',
        precipitationProbability: 20,
        humidityPercent: 20,
        windSpeedKph: 12.9,
        windDirectionLabel: 'SSW',
        sunrise: '5:58 AM',
        sunset: '7:11 PM',
        hourlyList: hourly,
      },
      {
        date: '2026-09-05',
        dayLabel: 'SAT',
        dateFormatted: '24 SAT',
        high: 41.1, // 106°
        low: 30.0,  // 86°
        dayConditionCode: 'clear-day',
        nightConditionCode: 'clear-night',
        conditionText: 'Mostly Sunny',
        precipitationProbability: 10,
        humidityPercent: 18,
        windSpeedKph: 14.5,
        windDirectionLabel: 'SW',
        sunrise: '5:59 AM',
        sunset: '7:10 PM',
        hourlyList: hourly,
      },
      {
        date: '2026-09-06',
        dayLabel: 'SUN',
        dateFormatted: '25 SUN',
        high: 39.4, // 103°
        low: 28.3,  // 83°
        dayConditionCode: 'partly-cloudy-day',
        nightConditionCode: 'partly-cloudy-night',
        conditionText: 'Partly Cloudy',
        precipitationProbability: 20,
        humidityPercent: 25,
        windSpeedKph: 16.0,
        windDirectionLabel: 'W',
        sunrise: '6:00 AM',
        sunset: '7:09 PM',
        hourlyList: hourly,
      },
      {
        date: '2026-09-07',
        dayLabel: 'MON',
        dateFormatted: '26 MON',
        high: 38.9, // 102°
        low: 27.8,  // 82°
        dayConditionCode: 'thunderstorm',
        nightConditionCode: 'cloudy',
        conditionText: 'Scattered Storms',
        precipitationProbability: 40,
        humidityPercent: 35,
        windSpeedKph: 20.0,
        windDirectionLabel: 'NW',
        sunrise: '6:00 AM',
        sunset: '7:07 PM',
        hourlyList: hourly,
      },
      {
        date: '2026-09-08',
        dayLabel: 'TUE',
        dateFormatted: '27 TUE',
        high: 37.8, // 100°
        low: 26.7,  // 80°
        dayConditionCode: 'rain',
        nightConditionCode: 'cloudy',
        conditionText: 'Chance of Showers',
        precipitationProbability: 30,
        humidityPercent: 32,
        windSpeedKph: 18.0,
        windDirectionLabel: 'N',
        sunrise: '6:01 AM',
        sunset: '7:06 PM',
        hourlyList: hourly,
      },
      {
        date: '2026-09-09',
        dayLabel: 'WED',
        dateFormatted: '28 WED',
        high: 39.4, // 103°
        low: 27.2,  // 81°
        dayConditionCode: 'clear-day',
        nightConditionCode: 'clear-night',
        conditionText: 'Sunny',
        precipitationProbability: 10,
        humidityPercent: 22,
        windSpeedKph: 11.0,
        windDirectionLabel: 'NE',
        sunrise: '6:02 AM',
        sunset: '7:04 PM',
        hourlyList: hourly,
      },
      {
        date: '2026-09-10',
        dayLabel: 'THU',
        dateFormatted: '29 THU',
        high: 40.0, // 104°
        low: 28.3,  // 83°
        dayConditionCode: 'clear-day',
        nightConditionCode: 'clear-night',
        conditionText: 'Sunny',
        precipitationProbability: 10,
        humidityPercent: 20,
        windSpeedKph: 10.0,
        windDirectionLabel: 'E',
        sunrise: '6:02 AM',
        sunset: '7:03 PM',
        hourlyList: hourly,
      }
    ];

    return {
      current,
      hourly,
      daily,
      alerts: [],
      fetchedAt: new Date().toISOString(),
    };
  }
}
