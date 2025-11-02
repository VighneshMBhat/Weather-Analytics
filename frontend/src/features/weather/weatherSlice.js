import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentWeather, getForecast } from '../../api/weatherClient';

const initialState = {
  byCity: {}, // { [cityKey]: { current, forecast, lastFetched, status, error } }
  status: 'idle',
  error: null,
};

/**
 * Normalize city key for consistent storage
 */
const normalizeCityKey = (city) => {
  return city.toLowerCase().trim();
};

/**
 * Fetch current weather for a city
 */
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city, thunkAPI) => {
    try {
      const data = await getCurrentWeather(city);
      return { city, data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

/**
 * Fetch forecast for a city
 */
export const fetchForecast = createAsyncThunk('weather/fetchForecast', async (city, thunkAPI) => {
  try {
    const data = await getForecast(city);
    return { city, data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

/**
 * Fetch all weather data (current + forecast)
 */
export const fetchAllWeatherData = createAsyncThunk(
  'weather/fetchAll',
  async (city, thunkAPI) => {
    try {
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);

      return {
        city,
        current: currentData,
        forecast: forecastData,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherError: (state) => {
      state.error = null;
    },
    removeCityData: (state, action) => {
      const cityKey = normalizeCityKey(action.payload);
      delete state.byCity[cityKey];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current weather
      .addCase(fetchCurrentWeather.pending, (state, action) => {
        const cityKey = normalizeCityKey(action.meta.arg);
        if (!state.byCity[cityKey]) {
          state.byCity[cityKey] = {};
        }
        state.byCity[cityKey].status = 'loading';
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        const cityKey = normalizeCityKey(action.payload.city);
        state.byCity[cityKey] = {
          ...state.byCity[cityKey],
          // Backend returns {cityName, current: {...}}, extract the nested current object
          current: action.payload.data.current || action.payload.data,
          // Store lat/lon for favorites functionality
          lat: action.payload.data.lat || action.payload.data.latitude,
          lon: action.payload.data.lon || action.payload.data.longitude,
          cityName: action.payload.data.cityName,
          lastFetched: Date.now(),
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        const cityKey = normalizeCityKey(action.meta.arg);
        if (state.byCity[cityKey]) {
          state.byCity[cityKey].status = 'failed';
          state.byCity[cityKey].error = action.payload;
        }
      })
      // Fetch forecast
      .addCase(fetchForecast.pending, (state, action) => {
        const cityKey = normalizeCityKey(action.meta.arg);
        if (!state.byCity[cityKey]) {
          state.byCity[cityKey] = {};
        }
        state.byCity[cityKey].status = 'loading';
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const cityKey = normalizeCityKey(action.payload.city);
        state.byCity[cityKey] = {
          ...state.byCity[cityKey],
          // Backend returns {forecast: {daily, hourly}}, extract the nested forecast object
          forecast: action.payload.data.forecast || action.payload.data,
          lastFetched: Date.now(),
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        const cityKey = normalizeCityKey(action.meta.arg);
        if (state.byCity[cityKey]) {
          state.byCity[cityKey].status = 'failed';
          state.byCity[cityKey].error = action.payload;
        }
      })
      // Fetch all weather data
      .addCase(fetchAllWeatherData.pending, (state, action) => {
        const cityKey = normalizeCityKey(action.meta.arg);
        if (!state.byCity[cityKey]) {
          state.byCity[cityKey] = {};
        }
        state.byCity[cityKey].status = 'loading';
      })
      .addCase(fetchAllWeatherData.fulfilled, (state, action) => {
        const cityKey = normalizeCityKey(action.payload.city);
        state.byCity[cityKey] = {
          // Backend returns {cityName, current: {...}}, extract the nested current object
          current: action.payload.current.current || action.payload.current,
          // Backend returns {forecast: {daily, hourly}}, extract the nested forecast object
          forecast: action.payload.forecast.forecast || action.payload.forecast,
          // Store lat/lon for favorites functionality
          lat: action.payload.current.lat || action.payload.current.latitude,
          lon: action.payload.current.lon || action.payload.current.longitude,
          cityName: action.payload.current.cityName,
          lastFetched: Date.now(),
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchAllWeatherData.rejected, (state, action) => {
        const cityKey = normalizeCityKey(action.meta.arg);
        if (state.byCity[cityKey]) {
          state.byCity[cityKey].status = 'failed';
          state.byCity[cityKey].error = action.payload;
        }
      });
  },
});

export const { clearWeatherError, removeCityData } = weatherSlice.actions;

export const selectWeatherByCity = (state, city) => {
  const cityKey = normalizeCityKey(city);
  return state.weather.byCity[cityKey];
};

export const selectAllCities = (state) => Object.keys(state.weather.byCity);

export default weatherSlice.reducer;
