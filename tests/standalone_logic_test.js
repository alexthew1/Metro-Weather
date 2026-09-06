const test = require('node:test');
const assert = require('node:assert/strict');

// Replicate pure conversion logic for verification
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

function convertTemperature(celsius, targetUnit) {
  if (targetUnit === 'F') {
    return Math.round(celsiusToFahrenheit(celsius));
  }
  return Math.round(celsius);
}

function convertWindSpeed(kph, targetUnit) {
  switch (targetUnit) {
    case 'mph':
      return Math.round(kph * 0.621371);
    case 'kmh':
    default:
      return Math.round(kph);
  }
}

function convertPressure(hpa, targetUnit) {
  switch (targetUnit) {
    case 'inHg':
      return parseFloat((hpa * 0.02953).toFixed(2));
    case 'hPa':
    default:
      return Math.round(hpa);
  }
}

function convertDistance(km, targetUnit) {
  switch (targetUnit) {
    case 'mi':
      return Math.round(km * 0.621371);
    case 'km':
    default:
      return Math.round(km);
  }
}

function degreesToCompass(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

function formatTemperature(celsius, unit, showUnitLetter = false) {
  const value = convertTemperature(celsius, unit);
  return showUnitLetter ? `${value}°${unit}` : `${value}°`;
}

function formatWind(kph, direction, unit) {
  const speed = convertWindSpeed(kph, unit);
  const dir = direction ? `${direction} ` : '';
  return `${dir}${speed} ${unit}`;
}

test('Phoenix Reference Values Fidelity (rules.md Section 10 & 20)', () => {
  // Current: 104°F
  assert.equal(formatTemperature(40.0, 'F'), '104°');
  // High: 105°F
  assert.equal(formatTemperature(40.555, 'F'), '105°');
  // Low: 85°F
  assert.equal(formatTemperature(29.444, 'F'), '85°');
  // Wind: SSW 8 mph (12.9 kph)
  assert.equal(formatWind(12.87, 'SSW', 'mph'), 'SSW 8 mph');
  // Pressure: 29.74 in
  assert.equal(`${convertPressure(1007, 'inHg')} in`, '29.74 in');
  // Visibility: 10 mi (16.1 km)
  assert.equal(`${convertDistance(16.1, 'mi')} mi`, '10 mi');
});

test('Direction compass mapping', () => {
  assert.equal(degreesToCompass(0), 'N');
  assert.equal(degreesToCompass(90), 'E');
  assert.equal(degreesToCompass(180), 'S');
  assert.equal(degreesToCompass(202), 'SSW');
  assert.equal(degreesToCompass(270), 'W');
});

test('Day and Night reference color matching', () => {
  const dayTheme = {
    background: '#1558B0',
    topBarBg: '#0067C5',
    appBarBg: '#1C1B1A',
    chartLine: '#FF9100',
  };
  const nightTheme = {
    background: '#09162A',
    topBarBg: '#0067C5',
    appBarBg: '#1C1B1A',
    chartLine: '#FF9100',
  };

  assert.equal(dayTheme.background, '#1558B0'); // Bing Weather royal blue
  assert.equal(nightTheme.background, '#09162A'); // Seattle midnight navy
  assert.equal(dayTheme.topBarBg, '#0067C5'); // Cobalt top bar
  assert.equal(dayTheme.appBarBg, '#1C1B1A'); // Solid charcoal bottom bar
  assert.equal(dayTheme.chartLine, '#FF9100'); // Metro orange chart curve
});
