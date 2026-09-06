import { WeatherProvider, WeatherDataBundle } from '../WeatherProvider';
import { WeatherLocation, CurrentWeather, HourlyForecast, DailyForecast } from '../types';
import { mapWmoCodeToCondition } from '../conditionMapping';
import { degreesToCompass } from '../../../utils/units';

export class OpenMeteoAdapter implements WeatherProvider {
  async searchLocations(query: string): Promise<WeatherLocation[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
      const data = await res.json();

      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((item: any) => ({
        id: `${item.latitude.toFixed(4)},${item.longitude.toFixed(4)}`,
        cityName: item.name,
        region: item.admin1 || item.admin2 || '',
        country: item.country || '',
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || 'UTC',
      }));
    } catch (err) {
      console.warn('Geocoding search failed:', err);
      return [];
    }
  }

  async getWeatherData(location: WeatherLocation, model?: string): Promise<WeatherDataBundle> {
    const { latitude, longitude, timezone } = location;
    const tzParam = encodeURIComponent(timezone || 'auto');
    let modelParam = '';
    if (model === 'icon') {
      modelParam = '&models=icon_seamless';
    } else if (model === 'jma') {
      modelParam = '&models=jma_seamless';
    } else if (model === 'gfs') {
      modelParam = '&models=gfs_seamless';
    } else {
      modelParam = '&models=best_match';
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=${tzParam}${modelParam}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OpenMeteo fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    const currentRaw = data.current || {};
    const dailyRaw = data.daily || {};
    const hourlyRaw = data.hourly || {};

    const isDay = currentRaw.is_day === 1;
    const currentCond = mapWmoCodeToCondition(currentRaw.weather_code ?? 0, isDay);
    const windDir = degreesToCompass(currentRaw.wind_direction_10m ?? 0);

    const todayHigh = dailyRaw.temperature_2m_max?.[0] ?? currentRaw.temperature_2m ?? 20;
    const todayLow = dailyRaw.temperature_2m_min?.[0] ?? currentRaw.temperature_2m ?? 10;
    const tonightLow = dailyRaw.temperature_2m_min?.[1] ?? todayLow;

    const current: CurrentWeather = {
      observedAt: currentRaw.time ? new Date(currentRaw.time).toISOString() : new Date().toISOString(),
      temperature: currentRaw.temperature_2m ?? 20,
      feelsLike: currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 20,
      isDay,
      conditionCode: currentCond.code,
      conditionText: currentCond.text,
      humidityPercent: currentRaw.relative_humidity_2m ?? 50,
      pressureHpa: currentRaw.surface_pressure ?? 1013,
      windSpeedKph: currentRaw.wind_speed_10m ?? 0,
      windDirectionDegrees: currentRaw.wind_direction_10m ?? 0,
      windDirectionLabel: windDir,
      precipitationProbability: dailyRaw.precipitation_probability_max?.[0] ?? 0,
      todayHigh,
      todayLow,
      tonightHigh: todayHigh,
      tonightLow,
      todayConditionText: currentCond.text,
      tonightConditionText: mapWmoCodeToCondition(dailyRaw.weather_code?.[0] ?? 0, false).text,
    };

    // Format next 24 hours
    const hourly: HourlyForecast[] = [];
    if (hourlyRaw.time && Array.isArray(hourlyRaw.time)) {
      const now = new Date();
      let startIndex = 0;
      for (let i = 0; i < hourlyRaw.time.length; i++) {
        const itemTime = new Date(hourlyRaw.time[i]);
        if (itemTime >= now) {
          startIndex = i;
          break;
        }
      }

      for (let i = startIndex; i < Math.min(startIndex + 24, hourlyRaw.time.length); i++) {
        const hTimeStr = hourlyRaw.time[i];
        const hDate = new Date(hTimeStr);
        const hours = hDate.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const formattedHour = `${displayHours}:00 ${ampm}`;

        const hIsDay = hours >= 6 && hours < 20;
        const hCond = mapWmoCodeToCondition(hourlyRaw.weather_code?.[i] ?? 0, hIsDay);

        hourly.push({
          time: formattedHour,
          temperature: hourlyRaw.temperature_2m?.[i] ?? 20,
          feelsLike: hourlyRaw.apparent_temperature?.[i],
          conditionCode: hCond.code,
          conditionText: hCond.text,
          precipitationProbability: hourlyRaw.precipitation_probability?.[i] ?? 0,
          humidityPercent: hourlyRaw.relative_humidity_2m?.[i],
          windSpeedKph: hourlyRaw.wind_speed_10m?.[i],
          windDirectionLabel: degreesToCompass(hourlyRaw.wind_direction_10m?.[i] ?? 0),
        });
      }
    }

    // Format 7 daily forecasts with their own 24-hour hourly predictions
    const daily: DailyForecast[] = [];
    const daysAbbrev = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    if (dailyRaw.time && Array.isArray(dailyRaw.time)) {
      for (let i = 0; i < dailyRaw.time.length; i++) {
        const dStr = dailyRaw.time[i];
        const dObj = new Date(dStr + 'T12:00:00');
        const dayLabel = daysAbbrev[dObj.getDay()];
        const dayNum = dObj.getDate();
        const dateFormatted = `${dayNum} ${dayLabel}`;

        const dayCond = mapWmoCodeToCondition(dailyRaw.weather_code?.[i] ?? 0, true);
        const nightCond = mapWmoCodeToCondition(dailyRaw.weather_code?.[i] ?? 0, false);

        // Day specific 24-hour prediction
        const dayHourly: HourlyForecast[] = [];
        const dayStart = i * 24;
        if (hourlyRaw.time && Array.isArray(hourlyRaw.time)) {
          for (let hIdx = dayStart; hIdx < Math.min(dayStart + 24, hourlyRaw.time.length); hIdx++) {
            const hDate = new Date(hourlyRaw.time[hIdx]);
            const hours = hDate.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const formattedHour = `${displayHours}:00 ${ampm}`;
            const hIsDay = hours >= 6 && hours < 20;
            const hCond = mapWmoCodeToCondition(hourlyRaw.weather_code?.[hIdx] ?? 0, hIsDay);
            dayHourly.push({
              time: formattedHour,
              temperature: hourlyRaw.temperature_2m?.[hIdx] ?? 20,
              feelsLike: hourlyRaw.apparent_temperature?.[hIdx],
              conditionCode: hCond.code,
              conditionText: hCond.text,
              precipitationProbability: hourlyRaw.precipitation_probability?.[hIdx] ?? 0,
              humidityPercent: hourlyRaw.relative_humidity_2m?.[hIdx],
              windSpeedKph: hourlyRaw.wind_speed_10m?.[hIdx],
              windDirectionLabel: degreesToCompass(hourlyRaw.wind_direction_10m?.[hIdx] ?? 0),
            });
          }
        }

        daily.push({
          date: dStr,
          dayLabel,
          dateFormatted,
          high: dailyRaw.temperature_2m_max?.[i] ?? 20,
          low: dailyRaw.temperature_2m_min?.[i] ?? 10,
          dayConditionCode: dayCond.code,
          nightConditionCode: nightCond.code,
          conditionText: dayCond.text,
          precipitationProbability: dailyRaw.precipitation_probability_max?.[i] ?? 0,
          sunrise: dailyRaw.sunrise?.[i] ? new Date(dailyRaw.sunrise[i]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : undefined,
          sunset: dailyRaw.sunset?.[i] ? new Date(dailyRaw.sunset[i]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : undefined,
          hourlyList: dayHourly.length > 0 ? dayHourly : hourly,
        });
      }
    }

    return {
      current,
      hourly,
      daily,
      alerts: [],
      fetchedAt: new Date().toISOString(),
    };
  }
}
