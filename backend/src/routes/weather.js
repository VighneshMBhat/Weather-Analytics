const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const { getHistoricalSnapshots } = require('../services/supabaseService');
const CacheManager = require('../cache');
const { convertWeatherData } = require('../utils/temperatureConverter');

// Create cache instance with 60s TTL
const weatherCache = new CacheManager(60);

/**
 * ALL API KEYS ARE KEPT ON BACKEND - NEVER EXPOSED TO FRONTEND
 * Frontend calls these routes, backend securely calls WeatherAPI.com
 * Temperature conversion handled on backend (WeatherAPI.com returns Celsius only)
 */

/**
 * GET /api/weather/current?city=<cityName or lat,lng>&unit=<celsius|fahrenheit>
 * Returns current weather data with caching
 * Temperature conversion handled on backend
 */
router.get('/current', async (req, res) => {
  const { city, unit = 'celsius' } = req.query;
  
  try {
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const cacheKey = `current:${city}`;

    const currentWeather = await weatherCache.getOrFetch(cacheKey, () =>
      weatherService.fetchCurrentWeather(city)
    );

    // Convert temperature based on user preference
    const convertedData = convertWeatherData(currentWeather, unit);

    res.json({
      success: true,
      data: convertedData,
      cached: weatherCache.has(cacheKey),
      cacheStats: weatherCache.getStats(),
    });
  } catch (error) {
    console.error('❌ Error fetching current weather for:', city || 'unknown');
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather data',
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined,
    });
  }
});

/**
 * GET /api/weather/forecast?city=<>&days=<number>&unit=<celsius|fahrenheit>
 * Returns multi-day forecast with hourly data
 * Temperature conversion handled on backend
 */
router.get('/forecast', async (req, res) => {
  try {
    const { city, days = 7, unit = 'celsius' } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const cacheKey = `forecast:${city}:${days}`;

    const forecastData = await weatherCache.getOrFetch(
      cacheKey,
      () => weatherService.fetchForecast(city, parseInt(days)),
      120 // Cache for 2 minutes (forecast changes less frequently)
    );

    // Convert temperature based on user preference
    const convertedData = convertWeatherData(forecastData, unit);

    res.json({
      success: true,
      data: convertedData,
    });
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch forecast data',
    });
  }
});

/**
 * GET /api/weather/hourly?city=<>&hours=<number>&unit=<celsius|fahrenheit>
 * Returns hourly forecast
 * Temperature conversion handled on backend
 */
router.get('/hourly', async (req, res) => {
  try {
    const { city, hours = 24, unit = 'celsius' } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const cacheKey = `hourly:${city}:${hours}`;

    const hourlyData = await weatherCache.getOrFetch(
      cacheKey,
      () => weatherService.fetchHourly(city, parseInt(hours)),
      120
    );

    // Convert temperature based on user preference
    const convertedData = convertWeatherData(hourlyData, unit);

    res.json({
      success: true,
      data: convertedData,
    });
  } catch (error) {
    console.error('Error fetching hourly data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch hourly data',
    });
  }
});

/**
 * GET /api/weather/historical?city=<>&date=YYYY-MM-DD&unit=<celsius|fahrenheit>
 * Fetch historical weather data from WeatherAPI.com
 * API Key is kept secure on backend
 * Temperature conversion handled on backend
 */
router.get('/historical', async (req, res) => {
  try {
    const { city, date, unit = 'celsius' } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required (format: YYYY-MM-DD)' });
    }

    const cacheKey = `historical:${city}:${date}`;

    const historicalData = await weatherCache.getOrFetch(
      cacheKey,
      () => weatherService.fetchHistorical(city, date),
      3600 // Cache for 1 hour (historical data doesn't change)
    );

    // Convert temperature based on user preference
    const convertedData = convertWeatherData(historicalData, unit);

    res.json({
      success: true,
      data: convertedData,
    });
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch historical data',
    });
  }
});

/**
 * GET /api/weather/future?city=<>&date=YYYY-MM-DD&unit=<celsius|fahrenheit>
 * Fetch future weather data from WeatherAPI.com
 * API Key is kept secure on backend
 * Temperature conversion handled on backend
 */
router.get('/future', async (req, res) => {
  try {
    const { city, date, unit = 'celsius' } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required (format: YYYY-MM-DD)' });
    }

    const cacheKey = `future:${city}:${date}`;

    const futureData = await weatherCache.getOrFetch(
      cacheKey,
      () => weatherService.fetchFuture(city, date),
      300 // Cache for 5 minutes
    );

    // Convert temperature based on user preference
    const convertedData = convertWeatherData(futureData, unit);

    res.json({
      success: true,
      data: convertedData,
    });
  } catch (error) {
    console.error('Error fetching future data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch future data',
    });
  }
});

/**
 * GET /api/weather/supabase-historical?city=<>&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Read historical snapshots stored in Supabase database
 */
router.get('/supabase-historical', async (req, res) => {
  try {
    const { city, from, to } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const { data, error } = await getHistoricalSnapshots(city, from, to);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch historical data',
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch historical data',
    });
  }
});

/**
 * GET /api/weather/search?q=<query>&limit=5
 * Search cities for autocomplete
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const cacheKey = `search:${q}:${limit}`;

    const cities = await weatherCache.getOrFetch(
      cacheKey,
      () => weatherService.searchCities(q, parseInt(limit)),
      300 // Cache search results for 5 minutes
    );

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error('Error searching cities:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search cities',
    });
  }
});

module.exports = router;
