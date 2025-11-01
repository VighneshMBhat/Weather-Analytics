import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAllWeatherData, selectWeatherByCity } from '../features/weather/weatherSlice';
import { selectUnit } from '../features/settings/settingsSlice';
import { formatTemperature, formatWindSpeed, formatTime } from '../utils/converters';
import { getWeatherIcon, getWeatherGradient } from '../utils/weatherIcons';
import { usePolling } from '../hooks/usePolling';
import FavoriteButton from './FavoriteButton';
import TempChart from './Charts/TempChart';
import PrecipChart from './Charts/PrecipChart';
import WindChart from './Charts/WindChart';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unit = useSelector(selectUnit);
  const decodedCityName = decodeURIComponent(cityName);
  const weatherData = useSelector((state) => selectWeatherByCity(state, decodedCityName));
  const [isLoading, setIsLoading] = useState(false);

  // Fetch weather data on mount
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchAllWeatherData(decodedCityName)).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch, decodedCityName]);

  // Set up polling for real-time updates
  usePolling(
    () => {
      dispatch(fetchAllWeatherData(decodedCityName));
    },
    60000, // 60 seconds
    true
  );

  const handleBack = () => {
    navigate('/');
  };

  const handleDownloadCSV = () => {
    if (!weatherData?.forecast?.hourly) return;

    const csvData = weatherData.forecast.hourly.map((item) => ({
      time: new Date(item.dt * 1000).toISOString(),
      temp: item.temp,
      feels_like: item.feels_like,
      humidity: item.humidity,
      wind_speed: item.wind_speed,
      pop: item.pop,
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map((row) => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${decodedCityName}-weather-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData || !weatherData.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Unable to load weather data</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { current, forecast } = weatherData;
  const weatherIcon = current.weather?.icon || '';
  const weatherDesc = current.weather?.description || '';
  const gradient = getWeatherGradient(weatherIcon, weatherDesc);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Current Weather Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden`}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{decodedCityName}</h1>
                <p className="text-xl opacity-90 capitalize">{weatherDesc}</p>
              </div>
              <div className="text-8xl" role="img" aria-label={weatherDesc}>
                {getWeatherIcon(weatherIcon, weatherDesc)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-6xl font-bold mb-2">
                  {formatTemperature(current.temp, unit)}
                </div>
                <div className="text-lg opacity-90">
                  Feels like {formatTemperature(current.feels_like, unit)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💧</span>
                  <span>Humidity: {current.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💨</span>
                  <span>Wind: {formatWindSpeed(current.wind_speed, unit)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌡️</span>
                  <span>Pressure: {current.pressure} hPa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">☀️</span>
                  <span>UV Index: {current.uvi?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌅</span>
                  <span>Sunrise: {formatTime(current.sunrise)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌇</span>
                  <span>Sunset: {formatTime(current.sunset)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <FavoriteButton
                cityName={decodedCityName}
                lat={weatherData.lat}
                lon={weatherData.lon}
                className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCSV}
                className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center space-x-2"
              >
                <span>📥</span>
                <span>Download CSV</span>
              </motion.button>
            </div>
          </div>

          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        </motion.div>

        {/* Charts Section */}
        {forecast && (
          <div className="space-y-6">
            {/* Hourly Temperature Chart */}
            {forecast.hourly && forecast.hourly.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TempChart
                  data={forecast.hourly.slice(0, 24)}
                  title="24-Hour Temperature Forecast"
                  showBrush={true}
                />
              </motion.div>
            )}

            {/* 7-Day Forecast */}
            {forecast.daily && forecast.daily.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TempChart
                  data={forecast.daily.map((d) => ({
                    dt: d.dt,
                    temp: d.temp.day,
                    feels_like: d.feels_like.day,
                  }))}
                  title="7-Day Temperature Forecast"
                />
              </motion.div>
            )}

            {/* Precipitation Chart */}
            {forecast.hourly && forecast.hourly.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <PrecipChart data={forecast.hourly.slice(0, 24)} />
              </motion.div>
            )}

            {/* Wind Chart */}
            {forecast.hourly && forecast.hourly.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <WindChart data={forecast.hourly.slice(0, 24)} />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
