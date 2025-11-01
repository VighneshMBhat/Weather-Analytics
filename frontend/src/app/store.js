import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import settingsReducer from '../features/settings/settingsSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values
        ignoredActions: ['auth/setSession'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.session'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.session'],
      },
    }),
});

export default store;
