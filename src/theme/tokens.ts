export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Windows Phone 8 / 8.1 Bing Weather Day Theme (Redmond reference)
export const dayColors = {
  background: '#1558B0', // Iconic Bing Weather Royal Blue
  backgroundSecondary: '#1862C6',
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceTranslucent: 'rgba(21, 88, 176, 0.85)',
  cardBg: 'rgba(255, 255, 255, 0.08)',
  cardPressed: 'rgba(255, 255, 255, 0.18)',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.70)',
  textDim: 'rgba(255, 255, 255, 0.45)',
  textMuted: 'rgba(255, 255, 255, 0.28)',

  // Separators & Outlines
  divider: 'rgba(255, 255, 255, 0.25)',
  dividerSubtle: 'rgba(255, 255, 255, 0.14)',
  border: '#FFFFFF',

  // Accent & Top Bar
  accent: '#1BA1E2',
  topBarBg: '#0067C5', // Windows Phone status bar blue
  chartLine: '#FF9100', // Metro orange chart curve
  chartBar: 'rgba(255, 255, 255, 0.25)',

  // Precipitation & alerts
  droplet: '#7FD6FF',
  alert: '#E51400',

  // App Bar (Persistent solid charcoal)
  appBarBg: '#1C1B1A',
  appBarBorder: 'rgba(255, 255, 255, 0.15)',

  // Scrim Overlay for today background photo
  scrimOverlay: 'rgba(15, 65, 140, 0.38)',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Windows Phone 8 / 8.1 Bing Weather Night Theme (Seattle reference)
export const nightColors = {
  background: '#09162A', // Deep Seattle Midnight Navy Blue
  backgroundSecondary: '#0B1B34',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceTranslucent: 'rgba(9, 22, 42, 0.85)',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardPressed: 'rgba(255, 255, 255, 0.12)',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.60)',
  textDim: 'rgba(255, 255, 255, 0.38)',
  textMuted: 'rgba(255, 255, 255, 0.22)',

  // Separators & Outlines
  divider: 'rgba(255, 255, 255, 0.18)',
  dividerSubtle: 'rgba(255, 255, 255, 0.10)',
  border: '#FFFFFF',

  // Accent & Top Bar
  accent: '#1BA1E2',
  topBarBg: '#0067C5',
  chartLine: '#FF9100',
  chartBar: 'rgba(0, 210, 255, 0.25)',

  // Precipitation & alerts
  droplet: '#58C3E5',
  alert: '#E51400',

  // App Bar
  appBarBg: '#1C1B1A',
  appBarBorder: 'rgba(255, 255, 255, 0.15)',

  // Scrim Overlay for today background photo
  scrimOverlay: 'rgba(7, 18, 35, 0.65)',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const colors = {
  ...dayColors,
  accentCyan: '#1BA1E2',
  accentTeal: '#00ABA9',
  accentCobalt: '#0050EF',
  accentCrimson: '#A20025',
  accentOrange: '#FA6800',
  accentAmber: '#F0A30A',
  accentEmerald: '#008A00',
};

export function getThemeColors(isDay: boolean = true) {
  return isDay ? dayColors : nightColors;
}

export type ThemeColors = typeof colors;
