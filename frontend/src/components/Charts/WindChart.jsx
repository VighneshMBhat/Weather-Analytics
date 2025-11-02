import React from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { selectUnit } from '../../features/settings/settingsSlice';
import { formatDateTime } from '../../utils/converters';

const WindChart = ({ data, title = 'Wind Speed' }) => {
  const unit = useSelector(selectUnit);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No wind data available</div>
    );
  }

  const chartData = data.map((item) => ({
    time: item.dt,
    timeLabel: formatDateTime(item.dt),
    wind_speed: unit === 'metric' ? item.wind_speed * 3.6 : item.wind_speed * 2.237, // Convert to km/h or mph
    wind_deg: item.wind_deg,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const windSpeed = payload[0].value.toFixed(1);
      const windDir = payload[0].payload.wind_deg;
      const direction = getWindDirection(windDir);
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">{payload[0].payload.timeLabel}</p>
          <p className="text-sm text-green-600">
            Wind: {windSpeed} {unit === 'metric' ? 'km/h' : 'mph'}
          </p>
          <p className="text-sm text-gray-600">
            Direction: {direction} ({windDir}°)
          </p>
        </div>
      );
    }
    return null;
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-3xl shadow-soft p-6 border border-white/20">
      <h3 className="text-xl font-bold mb-4 bg-gradient-3 bg-clip-text text-transparent">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="timeLabel"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: unit === 'metric' ? 'km/h' : 'mph',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="wind_speed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Wind Speed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindChart;
