const axios = require('axios');

/**
 * Open-Meteo API Service
 * Free weather API - no API key required!
 * Documentation: https://open-meteo.com/en/docs
 */

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

console.log('✅ Open-Meteo API configured (no key required)');
console.log('✅ Open-Meteo Base URL:', OPEN_METEO_BASE_URL);

/**
 * Geocode city name to coordinates
 * Handles formats like "Bengaluru, Karnataka, India" or "London, GB" or just "Paris"
 */
async function geocodeCity(cityName) {
  // Extract just the city name (before first comma) for better geocoding
  const cleanCityName = cityName.split(',')[0].trim();
  
  const url = `${GEOCODING_BASE_URL}/search`;
  
  const response = await axios.get(url, {
    params: {
      name: cleanCityName,
      count: 1,
      language: 'en',
      format: 'json',
    },
  });

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error(`City not found: ${cleanCityName}`);
  }

  const result = response.data.results[0];
  return {
    name: result.name,
    country: result.country,
    lat: result.latitude,
    lon: result.longitude,
    timezone: result.timezone,
  };
}

/**
 * Fetch current weather from Open-Meteo
 */
async function fetchCurrentWeather(cityName) {
  // First, geocode the city
  const location = await geocodeCity(cityName);
  
  const url = `${OPEN_METEO_BASE_URL}/forecast`;
  
  const response = await axios.get(url, {
    params: {
      latitude: location.lat,
      longitude: location.lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      timezone: 'auto',
    },
  });

  const data = response.data;
  const current = data.current;

  // Map weather code to description
  const weatherDesc = getWeatherDescription(current.weather_code);

  return {
    cityName: `${location.name}, ${location.country}`,
    lat: location.lat,
    lon: location.lon,
    timezone: data.timezone,
    current: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      wind_speed: current.wind_speed_10m / 3.6, // Convert km/h to m/s
      wind_deg: current.wind_direction_10m,
      clouds: current.cloud_cover,
      weather: {
        description: weatherDesc,
        code: current.weather_code,
        icon: getWeatherIcon(current.weather_code),
      },
      last_updated: current.time,
    },
  };
}

/**
 * Fetch forecast from Open-Meteo
 */
async function fetchForecast(cityName, days = 7) {
  const location = await geocodeCity(cityName);
  
  const url = `${OPEN_METEO_BASE_URL}/forecast`;
  
  const response = await axios.get(url, {
    params: {
      latitude: location.lat,
      longitude: location.lon,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      hourly: [
        'temperature_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'relative_humidity_2m',
      ].join(','),
      forecast_days: days,
      timezone: 'auto',
    },
  });

  const data = response.data;

  // Process daily forecast
  const daily = data.daily.time.map((time, i) => ({
    dt: new Date(time).getTime() / 1000,
    temp: {
      day: (data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2,
      min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i],
    },
    wind_speed: data.daily.wind_speed_10m_max[i] / 3.6, // Convert to m/s
    pop: data.daily.precipitation_probability_max[i] / 100,
    precipitation: data.daily.precipitation_sum[i],
    weather: {
      description: getWeatherDescription(data.daily.weather_code[i]),
      code: data.daily.weather_code[i],
      icon: getWeatherIcon(data.daily.weather_code[i]),
    },
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  // Process hourly forecast
  const hourly = data.hourly.time.map((time, i) => ({
    dt: new Date(time).getTime() / 1000,
    temp: data.hourly.temperature_2m[i],
    feels_like: data.hourly.apparent_temperature[i],
    humidity: data.hourly.relative_humidity_2m[i],
    pressure: data.hourly.pressure_msl[i],
    wind_speed: data.hourly.wind_speed_10m[i] / 3.6, // Convert to m/s
    wind_deg: data.hourly.wind_direction_10m[i],
    pop: data.hourly.precipitation_probability[i] / 100,
    precipitation: data.hourly.precipitation[i],
    weather: {
      description: getWeatherDescription(data.hourly.weather_code[i]),
      code: data.hourly.weather_code[i],
      icon: getWeatherIcon(data.hourly.weather_code[i]),
    },
  }));

  return {
    cityName: `${location.name}, ${location.country}`,
    lat: location.lat,
    lon: location.lon,
    timezone: data.timezone,
    daily,
    hourly,
  };
}

/**
 * Search cities using Open-Meteo Geocoding API
 */
async function searchCities(query, limit = 5) {
  const url = `${GEOCODING_BASE_URL}/search`;
  
  const response = await axios.get(url, {
    params: {
      name: query,
      count: limit,
      language: 'en',
      format: 'json',
    },
  });

  if (!response.data.results) {
    return [];
  }

  return response.data.results.map((city) => ({
    name: city.name,
    country: city.country,
    region: city.admin1 || '',
    lat: city.latitude,
    lon: city.longitude,
    displayName: city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country}`
      : `${city.name}, ${city.country}`,
  }));
}

/**
 * Map Open-Meteo weather codes to descriptions
 * Full list: https://open-meteo.com/en/docs
 */
function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherCodes[code] || 'Unknown';
}

/**
 * Map Open-Meteo weather codes to icon identifiers
 */
function getWeatherIcon(code) {
  if (code === 0 || code === 1) return '01d'; // Clear
  if (code === 2) return '02d'; // Partly cloudy
  if (code === 3) return '03d'; // Cloudy
  if (code === 45 || code === 48) return '50d'; // Fog
  if (code >= 51 && code <= 57) return '09d'; // Drizzle
  if (code >= 61 && code <= 67) return '10d'; // Rain
  if (code >= 71 && code <= 77) return '13d'; // Snow
  if (code >= 80 && code <= 82) return '09d'; // Showers
  if (code >= 85 && code <= 86) return '13d'; // Snow showers
  if (code >= 95 && code <= 99) return '11d'; // Thunderstorm
  return '01d'; // Default
}

module.exports = {
  fetchCurrentWeather,
  fetchForecast,
  searchCities,
  geocodeCity,
};
