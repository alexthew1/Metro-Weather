import { TemperatureUnit, WindUnit, PressureUnit, DistanceUnit } from '../services/weather/types';

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function convertTemperature(celsius: number, targetUnit: TemperatureUnit): number {
  if (targetUnit === 'F') {
    return Math.round(celsiusToFahrenheit(celsius));
  }
  return Math.round(celsius);
}

export function convertWindSpeed(kph: number, targetUnit: WindUnit): number {
  switch (targetUnit) {
    case 'mph':
      return Math.round(kph * 0.621371);
    case 'knots':
      return Math.round(kph * 0.539957);
    case 'ms':
      return Math.round(kph / 3.6);
    case 'kmh':
    default:
      return Math.round(kph);
  }
}

export function convertPressure(hpa: number, targetUnit: PressureUnit): number {
  switch (targetUnit) {
    case 'inHg':
      // 1 hPa = 0.02953 inHg
      return parseFloat((hpa * 0.02953).toFixed(2));
    case 'mb':
    case 'hPa':
    default:
      return Math.round(hpa);
  }
}

export function convertDistance(km: number, targetUnit: DistanceUnit): number {
  switch (targetUnit) {
    case 'mi':
      return Math.round(km * 0.621371);
    case 'km':
    default:
      return Math.round(km);
  }
}

export function degreesToCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}
