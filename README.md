<div align="center">

# ⛅ Metro Weather

**A faithful continuation and modern reimagining of the classic Windows Phone 8 & 8.1 Bing Weather experience.**

Built with **React Native**, **Expo SDK 54**, and **TypeScript**, engineered around pure Metro design principles—prioritizing content over chrome, bold typographic hierarchy, fluid horizontal panoramas, and responsive motion.

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![New Architecture](https://img.shields.io/badge/New_Architecture-Enabled-34A853?style=for-the-badge)](https://reactnative.dev/docs/the-new-architecture/landing-page)
[![Platform](https://img.shields.io/badge/Platforms-Android_%7C_iOS_%7C_Web-orange?style=for-the-badge)](https://github.com/alexthew1/Metro-Weather)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Design Philosophy & Aesthetics](#-design-philosophy--aesthetics)
- [Key Features](#-key-features)
  - [Panorama Hub Navigation](#1-panorama-hub-navigation)
  - [Today Screen](#2-today-screen)
  - [Daily Forecast & Pivot Screen](#3-daily-forecast--pivot-screen)
  - [Hourly Forecast & Graph](#4-hourly-forecast--graph)
  - [Weather Radar & Maps](#5-weather-radar--maps)
  - [Location Management](#6-location-management)
  - [Metro Application Bar](#7-metro-application-bar)
  - [Settings & Personalization](#8-settings--personalization)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the App](#running-the-app)
- [Android Native Build](#-android-native-build)
- [Testing](#-testing)
- [License](#-license)

---

## 🌟 Overview

**Metro Weather** resurrects the beloved design language of Windows Phone 8 / 8.1 Bing Weather. In an era dominated by rounded glass cards and visual clutter, Metro Weather embraces **Swiss design principles**:

- 📏 **Typography as Hero**: Massive Open Sans Light numerals, crisp lowercase section headings, and carefully tuned baseline grids.
- ↔️ **Horizontal Panorama**: Natural lateral gestures guiding you effortlessly across weather horizons (`today`, `daily`, `hourly`, `maps`).
- 🎨 **Authentic Chromatic Palettes**: Redmond Day Royal Blue (`#1558B0`), Seattle Midnight Navy (`#09162A`), and the full 15-shade Windows Phone Live Tile accent color library.
- ⚡ **Zero-Lag Performance**: Powered by React Native's New Architecture with Hermes and native gesture handling.

---

## 🎨 Design Philosophy & Aesthetics

| Element | Redmond Day Theme | Seattle Midnight Night Theme |
| :--- | :--- | :--- |
| **Primary Background** | `#1558B0` (Bing Weather Blue) | `#09162A` (Deep Midnight Navy) |
| **Status / Top Bar** | `#0067C5` (Windows Phone Blue) | `#0067C5` (Windows Phone Blue) |
| **Application Bar** | `#1C1B1A` (Solid Charcoal) | `#1C1B1A` (Solid Charcoal) |
| **Chart Curve** | `#FF9100` (Metro Orange) | `#FF9100` (Metro Orange) |
| **Typography Family** | Open Sans (300 Light, 400 Regular, 600 SemiBold, 700 Bold) | Open Sans (300 Light, 400 Regular, 600 SemiBold, 700 Bold) |

### Authentic Live Tile Accent Colors
Personalize the app with authentic Windows Phone accent colors:
- **Cobalt** (`#0050EF`) • **Cyan** (`#1BA1E2`) • **Teal** (`#00ABA9`) • **Emerald** (`#008A00`)
- **Green** (`#60A917`) • **Lime** (`#A4C400`) • **Amber** (`#F0A30A`) • **Orange** (`#FA6800`)
- **Red** (`#E51400`) • **Crimson** (`#A20025`) • **Magenta** (`#D80073`) • **Purple** (`#76608A`)
- **Indigo** (`#6A00FF`) • **Steel** (`#647687`) • **Taupe** (`#87794E`)

---

## ✨ Key Features

### 1. Panorama Hub Navigation
- Smooth lateral paging powered by `react-native-pager-view` and `react-native-reanimated`.
- Fluid sliding title header with lowercase section tracking: `today` → `daily` → `hourly` → `maps`.
- Seamless background fill transitions when swiping between screens.

### 2. Today Screen
- **Massive Hero Temperature**: 156pt ultra-light numeral with superscript unit (`°F` / `°C`).
- **Condition Description**: Clean typographic condition banner.
- **Two-Column Weather Matrix**:
  - *Left Column*: Today High / Tonight Low with period condition indicators and WDT attribution.
  - *Right Column*: High-precision environmental telemetry including Feels Like, Humidity %, Visibility, Barometer Pressure, and Wind Speed + 16-point Compass Heading.
- **Atmospheric Backgrounds**: High-resolution curated weather photography with dynamic contrast scrims, or a toggleable clean solid-color surface.

### 3. Daily Forecast & Pivot Screen
- Multi-day forecast list with custom SVG weather icons and temperature bars.
- **Day Detail Pivot Screen**: Tap any day to launch a dedicated Windows Phone Pivot view featuring:
  - Diurnal breakdown: Morning, Afternoon, Evening, and Overnight metrics.
  - UV Index, Humidity, Barometer, and Precipitation Probability.
  - 24-hour localized hourly breakdown for the selected date.

### 4. Hourly Forecast & Graph
- **Metro Orange Chart Curve**: Vector temperature graph displaying continuous temperature curves with high/low peaks.
- Precipitation probability bar visualization beneath the curve.
- Scrollable detailed hourly rows with condition iconography and wind vectors.

### 5. Weather Radar & Maps
- Interactive radar powered by `react-native-maps` and Google Maps.
- **Layer Selector**:
  - NOAA HRRR Precipitation Radar
  - Satellite Cloud Cover & Radar Overlay
  - Temperature Thermal Heatmap
- **Timeline Scrub Bar**: Animated frame scrubber with Play/Pause controls for forecast radar playback up to +2 hours.
- Fullscreen interactive map expansion mode.

### 6. Location Management
- **Instant GPS Detection**: One-tap current location resolution using `expo-location` with edge-to-edge runtime permissions.
- **Multi-City Storage**: Persist favorite locations with offline caching via AsyncStorage.
- **Live Search & Geocoding**: Search global cities with instant autocomplete results.

### 7. Metro Application Bar
- Iconic persistent charcoal bottom bar (`#1C1B1A`) with circular button iconography:
  - 📍 **Locations List**
  - 🔍 **Search City**
  - 🎯 **Current GPS Location**
  - 🔄 **Refresh Weather**
- **Expandable Ellipsis Drawer (`...`)**: Smooth expansion revealing links to `settings` and `about`.

### 8. Settings & Personalization
- **Unit Conversions**:
  - Temperature: Fahrenheit (`°F`), Celsius (`°C`)
  - Wind Speed: `mph`, `km/h`, `m/s`, `knots`
  - Atmospheric Pressure: `inHg`, `hPa`, `mb`
  - Distance: `mi`, `km`
- **Theme Selection**: Auto (solar angle/condition-based), Force Day, Force Night.
- **Weather Imagery**: Toggle between Bing atmospheric photos and pure minimalist flat colors.
- **Top Accent Bar**: Toggle the Windows Phone blue top status bar.
- **Forecast Provider Adapter**: Switch between live real-time weather via **Open-Meteo** (no API key required) and the built-in offline **Mock Provider**.

---

## 🛠 Tech Stack & Dependencies

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React Native 0.81.5](https://reactnative.dev/), [Expo SDK 54](https://expo.dev/) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Navigation & Gestures** | [React Native Pager View](https://github.com/callstack/react-native-pager-view), [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/), [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) |
| **Mapping & Radar** | [React Native Maps](https://github.com/react-native-maps/react-native-maps) (Google Maps SDK & NOAA HRRR WMS/Tile Layers) |
| **Typography** | [@expo-google-fonts/open-sans](https://github.com/expo/google-fonts) |
| **Vector Icons** | [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons, Feather) |
| **State & Storage** | React Context + [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |
| **Weather APIs** | [Open-Meteo API](https://open-meteo.com/) (Free, open-source weather forecasting) |

---

## 📂 Project Structure

```
Metro-Weather/
├── android/                   # Native Android project (prebuild output)
├── src/
│   ├── components/
│   │   ├── metro/             # Core Metro UI component system
│   │   │   ├── MetroAppBar.tsx          # Iconic bottom circle app bar & menu
│   │   │   ├── MetroButton.tsx          # Metro outline button
│   │   │   ├── MetroDivider.tsx         # Hairline separators
│   │   │   ├── MetroPanoramaHeader.tsx  # Horizontal panorama tab track
│   │   │   ├── MetroToggle.tsx          # Windows Phone toggle switch
│   │   │   └── MetroTopBar.tsx          # Accent color status bar
│   │   └── weather/           # Weather presentation components
│   │       ├── ForecastRow.tsx          # Daily item row
│   │       ├── HourlyGraph.tsx          # Metro Orange curve chart
│   │       ├── HourlyRow.tsx            # Hourly item row
│   │       ├── WeatherBackground.tsx    # Dynamic photography / solid scrim
│   │       └── WeatherIcon.tsx          # Custom condition vector iconography
│   ├── hooks/
│   │   └── useWeather.ts      # Custom hook for weather data & refresh lifecycle
│   ├── screens/
│   │   ├── about/             # About modal & version info
│   │   ├── locations/         # Multi-city list & geocoding search
│   │   ├── settings/          # Settings screen (units, themes, tiles)
│   │   └── weather/           # Main panorama screens
│   │       ├── DailyScreen.tsx          # 7-10 day overview
│   │       ├── DayDetailPivotScreen.tsx # Detailed day pivot view
│   │       ├── DayDetailView.tsx        # Day detail sub-sections
│   │       ├── HourlyScreen.tsx         # Hourly breakdown & chart
│   │       ├── MapsScreen.tsx           # Weather radar & NOAA timeline
│   │       ├── TodayScreen.tsx          # Hero today weather overview
│   │       └── WeatherPager.tsx         # Master panorama pager hub
│   ├── services/
│   │   └── weather/           # Pluggable repository & adapter architecture
│   │       ├── conditionMapping.ts      # WMO code to condition mappings
│   │       ├── providerAdapters/        # Open-Meteo & Mock adapters
│   │       ├── types.ts                 # Domain data models & contracts
│   │       └── weatherRepository.ts     # Unified repository layer
│   ├── state/
│   │   ├── locationStore.tsx  # Active & saved locations state
│   │   └── settingsStore.tsx  # Units, theme, and UI preferences
│   ├── theme/
│   │   ├── tokens.ts          # Color palettes, spacing, and live-tile accents
│   │   └── typography.ts      # Open Sans type scale and text styles
│   └── utils/
│       ├── formatting.ts      # Formatted weather labels & compass conversion
│       ├── responsive.ts      # Scaling utilities for multiple resolutions
│       └── units.ts           # Temperature, wind, and pressure conversions
├── tests/
│   └── standalone_logic_test.js # Unit test suite for conversion formulas
├── App.tsx                    # Application entrypoint & font loader
├── app.config.js              # Dynamic Expo configuration & environment injection
├── app.json                   # Expo manifest & permission definitions
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (for Android emulator or device builds) or [Xcode](https://developer.apple.com/xcode/) (for iOS)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alexthew1/Metro-Weather.git
   cd Metro-Weather
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

The app includes Google Maps integration for the Radar & Maps page.

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your Google Maps API Key to `.env`:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

> **Note**: Weather forecasting works out of the box using **Open-Meteo** without requiring any weather API key!

### Running the App

Start the Expo development server:

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

---

## 🤖 Android Native Build

Metro Weather supports the React Native New Architecture and edge-to-edge Android displays.

### Regenerate Native Files (if needed)

```bash
npx expo prebuild --clean
```

### Build APK Locally with Gradle

```bash
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

The output APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk` or `android/app/build/outputs/apk/release/app-release.apk`

---

## 🧪 Testing

Run the unit test suite verifying temperature, wind, pressure unit conversion math, compass direction mapping, and theme color fidelity:

```bash
node --test tests/standalone_logic_test.js
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/alexthew1/Metro-Weather/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Crafted with passion for the golden era of mobile UI design.</sub>
</div>
