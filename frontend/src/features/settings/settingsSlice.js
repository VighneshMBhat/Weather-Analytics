import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unit: localStorage.getItem('weather-unit') || 'metric', // 'metric' | 'imperial'
  refreshSeconds: parseInt(localStorage.getItem('weather-refresh') || '60', 10),
  theme: localStorage.getItem('weather-theme') || 'light', // 'light' | 'dark'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnit: (state, action) => {
      state.unit = action.payload;
      localStorage.setItem('weather-unit', action.payload);
    },
    toggleUnit: (state) => {
      state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('weather-unit', state.unit);
    },
    setRefreshSeconds: (state, action) => {
      state.refreshSeconds = action.payload;
      localStorage.setItem('weather-refresh', action.payload.toString());
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('weather-theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('weather-theme', state.theme);
    },
  },
});

export const { setUnit, toggleUnit, setRefreshSeconds, setTheme, toggleTheme } =
  settingsSlice.actions;

export const selectUnit = (state) => state.settings.unit;
export const selectRefreshSeconds = (state) => state.settings.refreshSeconds;
export const selectTheme = (state) => state.settings.theme;

export default settingsSlice.reducer;
