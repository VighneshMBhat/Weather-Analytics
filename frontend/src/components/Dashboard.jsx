import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchCurrentWeather } from '../features/weather/weatherSlice';
import { loadFavorites, selectFavorites } from '../features/favorites/favoritesSlice';
import { selectSession } from '../features/auth/authSlice';
import { selectRefreshSeconds } from '../features/settings/settingsSlice';
import { usePolling } from '../hooks/usePolling';
import CityCard from './CityCard';
import SearchBar from './SearchBar';

// Default cities to show if no favorites
const DEFAULT_CITIES = [
  { name: 'New York, US', lat: 40.7128, lon: -74.006 },
  { name: 'London, GB', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const favorites = useSelector(selectFavorites);
  const refreshSeconds = useSelector(selectRefreshSeconds);
  const weather = useSelector((state) => state.weather.byCity);

  // Load favorites on mount
  useEffect(() => {
    const token = session?.access_token;
    dispatch(loadFavorites({ token }));
  }, [dispatch, session]);

  // Determine which cities to display
  const citiesToDisplay = favorites.length > 0
    ? favorites.map(fav => ({ name: fav.cityName, lat: fav.lat, lon: fav.lon }))
    : DEFAULT_CITIES;

  // Fetch initial weather data
  useEffect(() => {
    citiesToDisplay.forEach((city) => {
      dispatch(fetchCurrentWeather(city.name));
    });
  }, [dispatch, citiesToDisplay.length]); // Intentionally simplified dependency

  // Set up polling for real-time updates
  usePolling(
    () => {
      citiesToDisplay.forEach((city) => {
        dispatch(fetchCurrentWeather(city.name));
      });
    },
    refreshSeconds * 1000,
    true
  );

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-animated opacity-30 dark:opacity-20"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />
      <div className="absolute inset-0 bg-bg-light dark:bg-bg-dark" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SearchBar />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-1 bg-clip-text text-transparent mb-3">
            {favorites.length > 0 ? 'Your Favorite Cities' : 'Popular Cities'}
          </h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse" />
            Real-time updates every {refreshSeconds} seconds
          </motion.p>
        </motion.div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {citiesToDisplay.map((city, index) => {
            const cityKey = city.name.toLowerCase().trim();
            const weatherData = weather[cityKey];

            return (
              <CityCard
                key={city.name}
                cityName={city.name}
                weatherData={weatherData}
                index={index}
              />
            );
          })}
        </div>

        {/* Loading State */}
        {citiesToDisplay.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              📍 Add Your Favorite Cities
            </h3>
            <p className="text-gray-600">
              Search for any city using the search bar above, then click the heart icon to add it
              to your favorites. {!session && 'Sign in to sync your favorites across devices!'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
