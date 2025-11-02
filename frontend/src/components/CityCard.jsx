import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectUnit } from '../features/settings/settingsSlice';
import { formatTemperature, formatWindSpeed } from '../utils/converters';
import { getWeatherGradient } from '../utils/weatherIcons';
import FavoriteButton from './FavoriteButton';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

const CityCard = ({ cityName, weatherData, index = 0 }) => {
  const navigate = useNavigate();
  const unit = useSelector(selectUnit);

  if (!weatherData || !weatherData.current) {
    return null;
  }

  const { current } = weatherData;
  const weatherIcon = current.weather?.icon || '';
  const weatherDesc = current.weather?.description || '';
  const gradient = getWeatherGradient(weatherIcon, weatherDesc);

  const handleClick = () => {
    navigate(`/city/${encodeURIComponent(cityName)}`);
  };

  const isRecent = weatherData.lastFetched && (Date.now() - weatherData.lastFetched) < 60000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.03, y: -8 }}
      onClick={handleClick}
      className="group relative rounded-3xl overflow-hidden cursor-pointer backdrop-blur-md bg-surface-light dark:bg-surface-dark shadow-soft hover:shadow-glow transition-all duration-300"
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
      
      {/* Header with gradient */}
      <div className="relative p-6 text-gray-800 dark:text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-1 bg-gradient-1 bg-clip-text text-transparent">
              {cityName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize flex items-center gap-2">
              {isRecent && <span className="w-2 h-2 bg-success rounded-full animate-pulse" />}
              {weatherDesc}
            </p>
          </div>
          <div className="relative">
            <AnimatedWeatherIcon condition={weatherDesc} className="w-16 h-16 drop-shadow-lg" />
          </div>
        </div>

        <div className="mt-4">
          <motion.div 
            className="text-5xl font-bold bg-gradient-2 bg-clip-text text-transparent"
            animate={isRecent ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {formatTemperature(current.temp, unit)}
          </motion.div>
          <div className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Feels like {formatTemperature(current.feels_like, unit)}
          </div>
        </div>

        {/* Favorite button */}
        <div className="absolute top-4 right-4">
          <FavoriteButton
            cityName={cityName}
            lat={weatherData.lat}
            lon={weatherData.lon}
            className="backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-full"
          />
        </div>
      </div>

      {/* Details */}
      <div className="relative p-6 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl">💧</span>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
              <div className="font-semibold text-gray-800 dark:text-white">{current.humidity}%</div>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl">💨</span>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Wind</div>
              <div className="font-semibold text-gray-800 dark:text-white">{formatWindSpeed(current.wind_speed, unit)}</div>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl">🌡️</span>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Pressure</div>
              <div className="font-semibold text-gray-800 dark:text-white">{current.pressure} hPa</div>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-2xl">☁️</span>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Clouds</div>
              <div className="font-semibold text-gray-800 dark:text-white">{current.clouds || 'N/A'}%</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Last updated */}
      {weatherData.lastFetched && (
        <div className="relative px-6 pb-4 text-xs text-center">
          <span className="text-gray-400 dark:text-gray-500">
            Updated {Math.floor((Date.now() - weatherData.lastFetched) / 1000)}s ago
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CityCard;
