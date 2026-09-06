import { convertTemperature, convertWindSpeed, convertPressure, convertDistance } from './units';
import { TemperatureUnit, WindUnit, PressureUnit, DistanceUnit } from '../services/weather/types';

export function formatTemperature(celsius: number, unit: TemperatureUnit, showUnitLetter = false): string {
  const value = convertTemperature(celsius, unit);
  return showUnitLetter ? `${value}°${unit}` : `${value}°`;
}

export function formatWind(kph: number, direction: string | undefined, unit: WindUnit): string {
  const speed = convertWindSpeed(kph, unit);
  const dir = direction ? `${direction} ` : '';
  return `${dir}${speed} ${unit}`;
}

export function formatPressure(hpa: number | undefined, unit: PressureUnit): string {
  if (hpa === undefined) return '--';
  const val = convertPressure(hpa, unit);
  if (unit === 'inHg') {
    return `${val.toFixed(2)} in`;
  }
  return `${val} ${unit}`;
}

export function formatVisibility(km: number | undefined, unit: DistanceUnit): string {
  if (km === undefined) return '--';
  const val = convertDistance(km, unit);
  return `${val} ${unit}`;
}

export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

export function formatPrecipitation(percent: number): string {
  return `${Math.round(percent)}%`;
}

export function formatHourlyTime(isoString: string, timezone?: string): string {
  try {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 -> 12
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minStr} ${ampm}`;
  } catch {
    return isoString;
  }
}

export function formatCurrentDate(timezone?: string): string {
  const d = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}
