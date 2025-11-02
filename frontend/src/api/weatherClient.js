import axios from 'axios';
import store from '../app/store';

const API_BASE = process.env.REACT_APP_NODE_API_BASE || 'http://localhost:4000/api';

const weatherAPI = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * Get temperature unit from Redux store
 * Converts 'metric'/'imperial' to 'celsius'/'fahrenheit' for backend
 */
const getUnit = () => {
  const state = store.getState();
  const unit = state.settings?.unit || 'metric';
  // Backend expects 'celsius' or 'fahrenheit', but frontend uses 'metric' or 'imperial'
  return unit === 'imperial' ? 'fahrenheit' : 'celsius';
};

/**
 * Get current weather for a city
 * Temperature unit is automatically added from settings
 */
export const getCurrentWeather = async (city) => {
  try {
    const response = await weatherAPI.get('/weather/current', {
      params: { 
        city,
        unit: getUnit(),
      },
    });
    // Backend returns { success: true, data: {...} }, extract the data
    const data = response.data.data || response.data;
    console.log('✅ getCurrentWeather response for', city, ':', data);
    return data;
  } catch (error) {
    console.error('❌ getCurrentWeather error for', city, ':', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get forecast for a city
 * Temperature unit is automatically added from settings
 */
export const getForecast = async (city, days = 7) => {
  const response = await weatherAPI.get('/weather/forecast', {
    params: { 
      city, 
      days,
      unit: getUnit(),
    },
  });
  // Backend returns { success: true, data: {...} }, extract the data
  return response.data.data || response.data;
};

/**
 * Get hourly forecast for a city
 * Temperature unit is automatically added from settings
 */
export const getHourly = async (city, hours = 24) => {
  const response = await weatherAPI.get('/weather/hourly', {
    params: { 
      city, 
      hours,
      unit: getUnit(),
    },
  });
  // Backend returns { success: true, data: {...} }, extract the data
  return response.data.data || response.data;
};

/**
 * Get historical weather for a specific date
 * API Key is kept secure on backend - never exposed here
 * Temperature unit is automatically added from settings
 */
export const getHistorical = async (city, date) => {
  const response = await weatherAPI.get('/weather/historical', {
    params: { 
      city, 
      date,
      unit: getUnit(),
    },
  });
  // Backend returns { success: true, data: {...} }, extract the data
  return response.data.data || response.data;
};

/**
 * Get future weather for a specific date
 * API Key is kept secure on backend - never exposed here
 * Temperature unit is automatically added from settings
 */
export const getFuture = async (city, date) => {
  const response = await weatherAPI.get('/weather/future', {
    params: { 
      city, 
      date,
      unit: getUnit(),
    },
  });
  // Backend returns { success: true, data: {...} }, extract the data
  return response.data.data || response.data;
};

/**
 * Get historical snapshots stored in Supabase database
 */
export const getSupabaseHistorical = async (city, from, to) => {
  const response = await weatherAPI.get('/weather/supabase-historical', {
    params: { city, from, to },
  });
  // Backend returns { success: true, data: {...} }, extract the data
  return response.data.data || response.data;
};

/**
 * Search cities (autocomplete)
 */
export const searchCities = async (query, limit = 5) => {
  const response = await weatherAPI.get('/weather/search', {
    params: { q: query, limit },
  });
  // Backend returns { success: true, data: {...} }, extract the data
  return response.data.data || response.data;
};

/**
 * Get user favorites
 */
export const getFavorites = async (token) => {
  const response = await weatherAPI.get('/favorites', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Add favorite city
 */
export const addFavorite = async (token, cityName, lat, lon) => {
  const response = await weatherAPI.post(
    '/favorites',
    { cityName, lat, lon },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Remove favorite city
 */
export const removeFavorite = async (token, cityName) => {
  const response = await weatherAPI.delete(`/favorites/${encodeURIComponent(cityName)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default weatherAPI;
