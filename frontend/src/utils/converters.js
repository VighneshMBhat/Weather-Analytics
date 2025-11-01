/**
 * Temperature conversion utilities
 */

export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

export const fahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

export const formatTemperature = (temp, unit = 'metric') => {
  if (unit === 'imperial') {
    return `${Math.round(celsiusToFahrenheit(temp))}°F`;
  }
  return `${Math.round(temp)}°C`;
};

/**
 * Wind speed conversion (m/s to mph or km/h)
 */
export const formatWindSpeed = (speed, unit = 'metric') => {
  if (unit === 'imperial') {
    const mph = speed * 2.237; // m/s to mph
    return `${Math.round(mph)} mph`;
  }
  const kmh = speed * 3.6; // m/s to km/h
  return `${Math.round(kmh)} km/h`;
};

/**
 * Format date/time
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};
