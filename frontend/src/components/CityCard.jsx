import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectUnit } from '../features/settings/settingsSlice';
import { formatTemperature, formatWindSpeed } from '../utils/converters';
import { getWeatherIcon, getWeatherGradient } from '../utils/weatherIcons';
import FavoriteButton from './FavoriteButton';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-1">{cityName}</h3>
            <p className="text-sm opacity-90 capitalize">{weatherDesc}</p>
          </div>
          <div className="text-5xl" role="img" aria-label={weatherDesc}>
            {getWeatherIcon(weatherIcon, weatherDesc)}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-5xl font-bold">
            {formatTemperature(current.temp, unit)}
          </div>
          <div className="text-sm mt-1 opacity-90">
            Feels like {formatTemperature(current.feels_like, unit)}
          </div>
        </div>

        {/* Favorite button */}
        <div className="absolute top-4 right-4">
          <FavoriteButton
            cityName={cityName}
            lat={weatherData.lat}
            lon={weatherData.lon}
            className="bg-white bg-opacity-20 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Details */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💧</span>
          <div>
            <div className="text-xs text-gray-500">Humidity</div>
            <div className="font-semibold">{current.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-2xl">💨</span>
          <div>
            <div className="text-xs text-gray-500">Wind</div>
            <div className="font-semibold">{formatWindSpeed(current.wind_speed, unit)}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌡️</span>
          <div>
            <div className="text-xs text-gray-500">Pressure</div>
            <div className="font-semibold">{current.pressure} hPa</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-2xl">☀️</span>
          <div>
            <div className="text-xs text-gray-500">UV Index</div>
            <div className="font-semibold">{current.uvi?.toFixed(1) || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Last updated */}
      {weatherData.lastFetched && (
        <div className="px-6 pb-4 text-xs text-gray-400 text-center">
          Updated {Math.floor((Date.now() - weatherData.lastFetched) / 1000)}s ago
        </div>
      )}
    </motion.div>
  );
};

export default CityCard;
