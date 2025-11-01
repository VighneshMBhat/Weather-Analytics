import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavorites, addFavorite, removeFavorite } from '../../api/weatherClient';

const LOCAL_STORAGE_KEY = 'weather-favorites';

const initialState = {
  items: [], // { cityName, lat, lon, id }
  status: 'idle',
  error: null,
};

/**
 * Load favorites from localStorage (for non-authenticated users)
 */
const loadLocalFavorites = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

/**
 * Save favorites to localStorage
 */
const saveLocalFavorites = (favorites) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

/**
 * Load favorites from Supabase
 */
export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async ({ token, userId }, thunkAPI) => {
    try {
      if (!token) {
        // Load from localStorage for guests
        return loadLocalFavorites();
      }

      const response = await getFavorites(token);
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      return loadLocalFavorites();
    }
  }
);

/**
 * Add favorite
 */
export const addFavoriteCity = createAsyncThunk(
  'favorites/add',
  async ({ token, cityName, lat, lon }, thunkAPI) => {
    try {
      if (!token) {
        // Add to localStorage for guests
        const current = loadLocalFavorites();
        const newFavorite = { cityName, lat, lon, id: Date.now().toString() };
        const updated = [...current, newFavorite];
        saveLocalFavorites(updated);
        return newFavorite;
      }

      const response = await addFavorite(token, cityName, lat, lon);
      return { cityName, lat, lon, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

/**
 * Remove favorite
 */
export const removeFavoriteCity = createAsyncThunk(
  'favorites/remove',
  async ({ token, cityName }, thunkAPI) => {
    try {
      if (!token) {
        // Remove from localStorage for guests
        const current = loadLocalFavorites();
        const updated = current.filter((fav) => fav.cityName !== cityName);
        saveLocalFavorites(updated);
        return { cityName };
      }

      await removeFavorite(token, cityName);
      return { cityName };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      saveLocalFavorites([]);
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add favorite
      .addCase(addFavoriteCity.fulfilled, (state, action) => {
        const exists = state.items.find((fav) => fav.cityName === action.payload.cityName);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      // Remove favorite
      .addCase(removeFavoriteCity.fulfilled, (state, action) => {
        state.items = state.items.filter((fav) => fav.cityName !== action.payload.cityName);
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (state, cityName) =>
  state.favorites.items.some((fav) => fav.cityName === cityName);

export default favoritesSlice.reducer;
