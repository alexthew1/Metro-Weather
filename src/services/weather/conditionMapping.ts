import { WeatherConditionCode } from './types';

/**
 * Maps WMO Weather interpretation codes (0-99) to our unified WeatherConditionCode
 */
export function mapWmoCodeToCondition(wmoCode: number, isDay = true): { code: WeatherConditionCode; text: string } {
  switch (wmoCode) {
    case 0:
      return {
        code: isDay ? 'clear-day' : 'clear-night',
        text: isDay ? 'Sunny' : 'Clear',
      };
    case 1:
      return {
        code: isDay ? 'clear-day' : 'clear-night',
        text: isDay ? 'Mostly Sunny' : 'Mostly Clear',
      };
    case 2:
      return {
        code: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
        text: 'Partly Cloudy',
      };
    case 3:
      return {
        code: 'overcast',
        text: 'Overcast',
      };
    case 45:
    case 48:
      return {
        code: 'fog',
        text: 'Foggy',
      };
    case 51:
    case 53:
    case 55:
      return {
        code: 'drizzle',
        text: 'Drizzle',
      };
    case 56:
    case 57:
      return {
        code: 'sleet',
        text: 'Freezing Drizzle',
      };
    case 61:
      return {
        code: 'rain',
        text: 'Slight Rain',
      };
    case 63:
      return {
        code: 'rain',
        text: 'Rain',
      };
    case 65:
      return {
        code: 'heavy-rain',
        text: 'Heavy Rain',
      };
    case 66:
    case 67:
      return {
        code: 'sleet',
        text: 'Freezing Rain',
      };
    case 71:
      return {
        code: 'snow',
        text: 'Slight Snow',
      };
    case 73:
      return {
        code: 'snow',
        text: 'Snow',
      };
    case 75:
      return {
        code: 'snow',
        text: 'Heavy Snow',
      };
    case 77:
      return {
        code: 'snow',
        text: 'Snow Grains',
      };
    case 80:
    case 81:
      return {
        code: 'rain',
        text: 'Rain Showers',
      };
    case 82:
      return {
        code: 'heavy-rain',
        text: 'Violent Rain Showers',
      };
    case 85:
    case 86:
      return {
        code: 'snow',
        text: 'Snow Showers',
      };
    case 95:
      return {
        code: 'thunderstorm',
        text: 'Thunderstorm',
      };
    case 96:
    case 99:
      return {
        code: 'thunderstorm',
        text: 'Thunderstorm with Hail',
      };
    default:
      return {
        code: 'unknown',
        text: 'Unknown',
      };
  }
}

/**
 * Maps OpenWeatherMap weather IDs (2xx - 8xx) to unified WeatherConditionCode
 */
export function mapOwmCodeToCondition(owmId: number, isDay = true): { code: WeatherConditionCode; text: string } {
  if (owmId >= 200 && owmId < 300) {
    return { code: 'thunderstorm', text: 'Thunderstorm' };
  }
  if (owmId >= 300 && owmId < 400) {
    return { code: 'drizzle', text: 'Drizzle' };
  }
  if (owmId === 511) {
    return { code: 'sleet', text: 'Freezing Rain' };
  }
  if (owmId >= 500 && owmId < 600) {
    if (owmId >= 502 && owmId <= 504) {
      return { code: 'heavy-rain', text: 'Heavy Rain' };
    }
    return { code: 'rain', text: 'Rain' };
  }
  if (owmId >= 600 && owmId < 700) {
    return { code: 'snow', text: 'Snow' };
  }
  if (owmId === 741 || owmId === 701) {
    return { code: 'fog', text: 'Foggy' };
  }
  if (owmId === 711 || owmId === 721) {
    return { code: 'haze', text: 'Hazy' };
  }
  if (owmId === 771 || owmId === 781) {
    return { code: 'wind', text: 'Windy' };
  }
  if (owmId === 800) {
    return {
      code: isDay ? 'clear-day' : 'clear-night',
      text: isDay ? 'Sunny' : 'Clear',
    };
  }
  if (owmId === 801 || owmId === 802) {
    return {
      code: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
      text: 'Partly Cloudy',
    };
  }
  if (owmId === 803) {
    return {
      code: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
      text: 'Mostly Cloudy',
    };
  }
  if (owmId === 804) {
    return {
      code: 'overcast',
      text: 'Overcast',
    };
  }

  return {
    code: 'unknown',
    text: 'Unknown',
  };
}
