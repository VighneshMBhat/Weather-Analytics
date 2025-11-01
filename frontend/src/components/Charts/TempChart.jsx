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
  Brush,
} from 'recharts';
import { selectUnit } from '../../features/settings/settingsSlice';
import { formatTemperature, formatDateTime, celsiusToFahrenheit } from '../../utils/converters';

const TempChart = ({ data, title = 'Temperature Forecast', showBrush = false }) => {
  const unit = useSelector(selectUnit);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No temperature data available</div>
    );
  }

  const chartData = data.map((item) => ({
    time: item.dt,
    timeLabel: formatDateTime(item.dt),
    temp: unit === 'metric' ? item.temp : celsiusToFahrenheit(item.temp),
    feels_like: unit === 'metric' ? item.feels_like : celsiusToFahrenheit(item.feels_like),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">{payload[0].payload.timeLabel}</p>
          <p className="text-sm text-blue-600">
            Temperature: {formatTemperature(payload[0].value, unit)}
          </p>
          {payload[1] && (
            <p className="text-sm text-purple-600">
              Feels Like: {formatTemperature(payload[1].value, unit)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
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
            label={{ value: unit === 'metric' ? '°C' : '°F', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Temperature"
          />
          <Line
            type="monotone"
            dataKey="feels_like"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            name="Feels Like"
          />
          {showBrush && <Brush dataKey="timeLabel" height={30} stroke="#3b82f6" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TempChart;
