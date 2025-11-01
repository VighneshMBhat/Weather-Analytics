/**
 * Temperature conversion utilities
 * WeatherAPI.com returns data in Celsius by default
 * This handles conversion to Fahrenheit when needed
 */

/**
 * Convert Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
  if (celsius === null || celsius === undefined) return null;
  return (celsius * 9/5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
function fahrenheitToCelsius(fahrenheit) {
  if (fahrenheit === null || fahrenheit === undefined) return null;
  return (fahrenheit - 32) * 5/9;
}

/**
 * Convert temperature object based on unit preference
 * Handles both single values and nested temperature objects
 */
function convertTemperature(temp, targetUnit = 'celsius') {
  if (temp === null || temp === undefined) return temp;

  // If it's a number, convert directly
  if (typeof temp === 'number') {
    return targetUnit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
  }

  // If it's an object (like { day, min, max }), convert each property
  if (typeof temp === 'object') {
    const converted = {};
    for (const key in temp) {
      if (typeof temp[key] === 'number') {
        converted[key] = targetUnit === 'fahrenheit' 
          ? celsiusToFahrenheit(temp[key]) 
          : temp[key];
      } else {
        converted[key] = temp[key];
      }
    }
    return converted;
  }

  return temp;
}

/**
 * Convert weather data object to specified temperature unit
 * This traverses the entire weather data structure and converts all temperatures
 */
function convertWeatherData(weatherData, targetUnit = 'celsius') {
  if (!weatherData || targetUnit === 'celsius') {
    return weatherData; // No conversion needed
  }

  const converted = JSON.parse(JSON.stringify(weatherData)); // Deep clone

  // Convert current weather temperatures
  if (converted.current) {
    if (converted.current.temp !== undefined) {
      converted.current.temp = celsiusToFahrenheit(converted.current.temp);
    }
    if (converted.current.feels_like !== undefined) {
      converted.current.feels_like = celsiusToFahrenheit(converted.current.feels_like);
    }
  }

  // Convert hourly forecast temperatures
  if (converted.hourly && Array.isArray(converted.hourly)) {
    converted.hourly = converted.hourly.map(hour => ({
      ...hour,
      temp: hour.temp !== undefined ? celsiusToFahrenheit(hour.temp) : hour.temp,
      feels_like: hour.feels_like !== undefined ? celsiusToFahrenheit(hour.feels_like) : hour.feels_like,
    }));
  }

  // Convert daily forecast temperatures
  if (converted.daily && Array.isArray(converted.daily)) {
    converted.daily = converted.daily.map(day => ({
      ...day,
      temp: convertTemperature(day.temp, targetUnit),
    }));
  }

  // Convert summary temperatures (for historical/future data)
  if (converted.summary) {
    if (converted.summary.maxtemp_c !== undefined) {
      converted.summary.maxtemp_f = celsiusToFahrenheit(converted.summary.maxtemp_c);
    }
    if (converted.summary.mintemp_c !== undefined) {
      converted.summary.mintemp_f = celsiusToFahrenheit(converted.summary.mintemp_c);
    }
    if (converted.summary.avgtemp_c !== undefined) {
      converted.summary.avgtemp_f = celsiusToFahrenheit(converted.summary.avgtemp_c);
    }
  }

  // Add unit indicator
  converted.temperatureUnit = targetUnit;

  return converted;
}

module.exports = {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  convertTemperature,
  convertWeatherData,
};
