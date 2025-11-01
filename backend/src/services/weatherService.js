const axios = require('axios');
const { saveHistoricalSnapshot } = require('./supabaseService');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_PROVIDER = process.env.WEATHER_API_PROVIDER || 'weatherapi';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Weather service to fetch data from external weather API
 * Supports WeatherAPI.com (default)
 * API Key is kept secure on backend - never exposed to frontend
 */

/**
 * Parse location input (city name or lat,lon)
 */
function parseLocation(locationInput) {
  if (!locationInput) {
    throw new Error('Location is required');
  }

  // Check if it's coordinates (lat,lon)
  const coordMatch = locationInput.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return {
      type: 'coords',
      lat: parseFloat(coordMatch[1]),
      lon: parseFloat(coordMatch[2]),
    };
  }

  return {
    type: 'city',
    city: locationInput,
  };
}

/**
 * Fetch current weather from WeatherAPI.com
 * Includes AQI (Air Quality Index) data
 */
async function fetchCurrentWeatherAPI(city) {
  const url = `${WEATHERAPI_BASE_URL}/current.json`;
  
  const response = await axios.get(url, {
    params: {
      key: WEATHER_API_KEY,
      q: city,
      aqi: 'yes', // Include Air Quality Index
    },
  });

  const data = response.data;
  
  // Normalize to consistent format
  return {
    cityName: `${data.location.name}, ${data.location.country}`,
    lat: data.location.lat,
    lon: data.location.lon,
    timezone: data.location.tz_id,
    current: {
      temp: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
      wind_speed: data.current.wind_kph / 3.6, // Convert to m/s for consistency
      wind_deg: data.current.wind_degree,
      wind_dir: data.current.wind_dir,
      clouds: data.current.cloud,
      uvi: data.current.uv,
      visibility: data.current.vis_km,
      weather: {
        icon: data.current.condition.icon,
        description: data.current.condition.text,
        code: data.current.condition.code,
      },
      last_updated: data.current.last_updated,
      // Air Quality Index data
      aqi: data.current.air_quality ? {
        pm2_5: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10,
        us_epa_index: data.current.air_quality['us-epa-index'],
        gb_defra_index: data.current.air_quality['gb-defra-index'],
      } : null,
    },
  };
}

/**
 * Fetch forecast from WeatherAPI.com
 * Includes hourly data, daily forecast, AQI, and alerts
 */
async function fetchForecastWeatherAPI(city, days = 3) {
  const url = `${WEATHERAPI_BASE_URL}/forecast.json`;
  
  const response = await axios.get(url, {
    params: {
      key: WEATHER_API_KEY,
      q: city,
      days: days,
      aqi: 'yes', // Include Air Quality Index
      alerts: 'yes', // Include weather alerts
    },
  });

  const data = response.data;
  
  // Normalize forecast data
  return {
    cityName: `${data.location.name}, ${data.location.country}`,
    lat: data.location.lat,
    lon: data.location.lon,
    timezone: data.location.tz_id,
    alerts: data.alerts?.alert || [],
    hourly: data.forecast.forecastday.flatMap((day) =>
      day.hour.map((h) => ({
        dt: new Date(h.time).getTime() / 1000,
        temp: h.temp_c,
        feels_like: h.feelslike_c,
        humidity: h.humidity,
        pressure: h.pressure_mb,
        wind_speed: h.wind_kph / 3.6,
        wind_deg: h.wind_degree,
        pop: h.chance_of_rain / 100,
        precipitation: h.precip_mm,
        weather: {
          icon: h.condition.icon,
          description: h.condition.text,
          code: h.condition.code,
        },
      }))
    ),
    daily: data.forecast.forecastday.map((d) => ({
      dt: new Date(d.date).getTime() / 1000,
      temp: {
        day: d.day.avgtemp_c,
        min: d.day.mintemp_c,
        max: d.day.maxtemp_c,
      },
      humidity: d.day.avghumidity,
      wind_speed: d.day.maxwind_kph / 3.6,
      pop: d.day.daily_chance_of_rain / 100,
      precipitation: d.day.totalprecip_mm,
      weather: {
        icon: d.day.condition.icon,
        description: d.day.condition.text,
        code: d.day.condition.code,
      },
      sunrise: d.astro.sunrise,
      sunset: d.astro.sunset,
    })),
  };
}

/**
 * Fetch historical weather from WeatherAPI.com
 */
async function fetchHistoricalWeatherAPI(city, date) {
  const url = `${WEATHERAPI_BASE_URL}/history.json`;
  
  const response = await axios.get(url, {
    params: {
      key: WEATHER_API_KEY,
      q: city,
      dt: date, // Format: YYYY-MM-DD
    },
  });

  const data = response.data;
  
  return {
    cityName: `${data.location.name}, ${data.location.country}`,
    lat: data.location.lat,
    lon: data.location.lon,
    date: date,
    hourly: data.forecast.forecastday[0].hour.map((h) => ({
      dt: new Date(h.time).getTime() / 1000,
      temp: h.temp_c,
      feels_like: h.feelslike_c,
      humidity: h.humidity,
      pressure: h.pressure_mb,
      wind_speed: h.wind_kph / 3.6,
      wind_deg: h.wind_degree,
      precipitation: h.precip_mm,
      weather: {
        icon: h.condition.icon,
        description: h.condition.text,
        code: h.condition.code,
      },
    })),
    summary: {
      maxtemp_c: data.forecast.forecastday[0].day.maxtemp_c,
      mintemp_c: data.forecast.forecastday[0].day.mintemp_c,
      avgtemp_c: data.forecast.forecastday[0].day.avgtemp_c,
      totalprecip_mm: data.forecast.forecastday[0].day.totalprecip_mm,
      avghumidity: data.forecast.forecastday[0].day.avghumidity,
    },
  };
}

/**
 * Fetch future weather from WeatherAPI.com
 */
async function fetchFutureWeatherAPI(city, date) {
  const url = `${WEATHERAPI_BASE_URL}/future.json`;
  
  const response = await axios.get(url, {
    params: {
      key: WEATHER_API_KEY,
      q: city,
      dt: date, // Format: YYYY-MM-DD
    },
  });

  const data = response.data;
  
  return {
    cityName: `${data.location.name}, ${data.location.country}`,
    lat: data.location.lat,
    lon: data.location.lon,
    date: date,
    hourly: data.forecast.forecastday[0].hour.map((h) => ({
      dt: new Date(h.time).getTime() / 1000,
      temp: h.temp_c,
      feels_like: h.feelslike_c,
      humidity: h.humidity,
      pressure: h.pressure_mb,
      wind_speed: h.wind_kph / 3.6,
      wind_deg: h.wind_degree,
      precipitation: h.precip_mm,
      weather: {
        icon: h.condition.icon,
        description: h.condition.text,
        code: h.condition.code,
      },
    })),
    summary: {
      maxtemp_c: data.forecast.forecastday[0].day.maxtemp_c,
      mintemp_c: data.forecast.forecastday[0].day.mintemp_c,
      avgtemp_c: data.forecast.forecastday[0].day.avgtemp_c,
    },
  };
}

/**
 * Fetch current weather (main entry point)
 * API KEY is kept secure on backend - never exposed to client
 */
async function fetchCurrentWeather(locationInput) {
  const location = parseLocation(locationInput);
  const city = location.type === 'coords' ? `${location.lat},${location.lon}` : location.city;

  let weatherData;

  if (WEATHER_API_PROVIDER === 'weatherapi') {
    weatherData = await fetchCurrentWeatherAPI(city);
  } else {
    throw new Error(`Provider ${WEATHER_API_PROVIDER} not supported`);
  }

  // Optionally save snapshot to Supabase (sampled - not every request)
  // To reduce DB writes, sample 10% of requests
  if (Math.random() < 0.1) {
    saveHistoricalSnapshot(weatherData.cityName, weatherData.lat, weatherData.lon, weatherData).catch((err) => {
      console.error('Failed to save historical snapshot:', err);
    });
  }

  return weatherData;
}

/**
 * Fetch forecast (up to 14 days with WeatherAPI.com)
 */
async function fetchForecast(locationInput, days = 3) {
  const location = parseLocation(locationInput);
  const city = location.type === 'coords' ? `${location.lat},${location.lon}` : location.city;

  if (WEATHER_API_PROVIDER === 'weatherapi') {
    return await fetchForecastWeatherAPI(city, Math.min(days, 14)); // Max 14 days
  } else {
    throw new Error(`Provider ${WEATHER_API_PROVIDER} not supported`);
  }
}

/**
 * Fetch hourly forecast
 */
async function fetchHourly(locationInput, hours = 24) {
  const forecastData = await fetchForecast(locationInput, 3);

  return {
    cityName: forecastData.cityName,
    lat: forecastData.lat,
    lon: forecastData.lon,
    hourly: forecastData.hourly.slice(0, hours),
    timezone: forecastData.timezone,
  };
}

/**
 * Fetch historical weather
 */
async function fetchHistorical(locationInput, date) {
  const location = parseLocation(locationInput);
  const city = location.type === 'coords' ? `${location.lat},${location.lon}` : location.city;

  if (WEATHER_API_PROVIDER === 'weatherapi') {
    return await fetchHistoricalWeatherAPI(city, date);
  } else {
    throw new Error(`Provider ${WEATHER_API_PROVIDER} not supported`);
  }
}

/**
 * Fetch future weather
 */
async function fetchFuture(locationInput, date) {
  const location = parseLocation(locationInput);
  const city = location.type === 'coords' ? `${location.lat},${location.lon}` : location.city;

  if (WEATHER_API_PROVIDER === 'weatherapi') {
    return await fetchFutureWeatherAPI(city, date);
  } else {
    throw new Error(`Provider ${WEATHER_API_PROVIDER} not supported`);
  }
}

/**
 * Search cities (geocoding autocomplete)
 */
async function searchCities(query, limit = 5) {
  if (WEATHER_API_PROVIDER === 'weatherapi') {
    const url = `${WEATHERAPI_BASE_URL}/search.json`;
    
    const response = await axios.get(url, {
      params: {
        key: WEATHER_API_KEY,
        q: query,
      },
    });

    return response.data.slice(0, limit).map((city) => ({
      name: city.name,
      country: city.country,
      region: city.region,
      lat: city.lat,
      lon: city.lon,
      displayName: city.region
        ? `${city.name}, ${city.region}, ${city.country}`
        : `${city.name}, ${city.country}`,
    }));
  }

  throw new Error(`Provider ${WEATHER_API_PROVIDER} not supported`);
}

module.exports = {
  fetchCurrentWeather,
  fetchForecast,
  fetchHourly,
  fetchHistorical,
  fetchFuture,
  searchCities,
};
