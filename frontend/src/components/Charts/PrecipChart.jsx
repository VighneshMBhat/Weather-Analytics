import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatDateTime } from '../../utils/converters';

const PrecipChart = ({ data, title = 'Precipitation Probability' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No precipitation data available</div>
    );
  }

  const chartData = data.map((item) => ({
    time: item.dt,
    timeLabel: formatDateTime(item.dt),
    pop: (item.pop * 100).toFixed(0), // Convert to percentage
    humidity: item.humidity,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">{payload[0].payload.timeLabel}</p>
          <p className="text-sm text-blue-600">
            Precipitation: {payload[0].value}%
          </p>
          {payload[1] && (
            <p className="text-sm text-cyan-600">
              Humidity: {payload[1].value}%
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
        <BarChart data={chartData}>
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
            label={{ value: '%', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="pop" fill="#3b82f6" name="Precipitation %" />
          <Bar dataKey="humidity" fill="#06b6d4" opacity={0.6} name="Humidity %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrecipChart;
