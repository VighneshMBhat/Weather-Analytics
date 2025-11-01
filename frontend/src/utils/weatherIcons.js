/**
 * Weather icon mapping for WeatherAPI.com
 * WeatherAPI.com provides icon URLs like: //cdn.weatherapi.com/weather/64x64/day/116.png
 * We use emojis for consistency and offline support
 */
export const getWeatherIcon = (weatherIcon, description) => {
  const desc = (description || '').toLowerCase();
  const icon = weatherIcon || '';
  
  // WeatherAPI.com icon codes (extracted from URL)
  // Extract code from URL like "//cdn.weatherapi.com/weather/64x64/day/116.png"
  const codeMatch = icon.match(/\/(\d+)\.png$/);
  const code = codeMatch ? codeMatch[1] : '';

  // WeatherAPI.com condition codes mapping
  const codeMap = {
    '113': '☀️', // Sunny/Clear
    '116': '⛅', // Partly cloudy
    '119': '☁️', // Cloudy
    '122': '☁️', // Overcast
    '143': '🌫️', // Mist
    '176': '🌦️', // Patchy rain possible
    '179': '🌨️', // Patchy snow possible
    '182': '🌧️', // Patchy sleet possible
    '185': '🌧️', // Patchy freezing drizzle
    '200': '⛈️', // Thundery outbreaks possible
    '227': '🌨️', // Blowing snow
    '230': '❄️', // Blizzard
    '248': '🌫️', // Fog
    '260': '🌫️', // Freezing fog
    '263': '🌧️', // Patchy light drizzle
    '266': '🌧️', // Light drizzle
    '281': '🌧️', // Freezing drizzle
    '284': '🌧️', // Heavy freezing drizzle
    '293': '🌧️', // Patchy light rain
    '296': '🌧️', // Light rain
    '299': '🌧️', // Moderate rain at times
    '302': '🌧️', // Moderate rain
    '305': '🌧️', // Heavy rain at times
    '308': '🌧️', // Heavy rain
    '311': '🌧️', // Light freezing rain
    '314': '🌧️', // Moderate or heavy freezing rain
    '317': '🌨️', // Light sleet
    '320': '🌨️', // Moderate or heavy sleet
    '323': '🌨️', // Patchy light snow
    '326': '❄️', // Light snow
    '329': '❄️', // Patchy moderate snow
    '332': '❄️', // Moderate snow
    '335': '❄️', // Patchy heavy snow
    '338': '❄️', // Heavy snow
    '350': '🌧️', // Ice pellets
    '353': '🌧️', // Light rain shower
    '356': '🌧️', // Moderate or heavy rain shower
    '359': '🌧️', // Torrential rain shower
    '362': '🌨️', // Light sleet showers
    '365': '🌨️', // Moderate or heavy sleet showers
    '368': '🌨️', // Light snow showers
    '371': '❄️', // Moderate or heavy snow showers
    '374': '🌧️', // Light showers of ice pellets
    '377': '🌧️', // Moderate or heavy showers of ice pellets
    '386': '⛈️', // Patchy light rain with thunder
    '389': '⛈️', // Moderate or heavy rain with thunder
    '392': '⛈️', // Patchy light snow with thunder
    '395': '⛈️', // Moderate or heavy snow with thunder
  };

  if (codeMap[code]) {
    return codeMap[code];
  }

  // Fallback based on description
  if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
  if (desc.includes('partly cloudy')) return '⛅';
  if (desc.includes('cloud') || desc.includes('overcast')) return '☁️';
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) return '🌧️';
  if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
  if (desc.includes('snow') || desc.includes('blizzard')) return '❄️';
  if (desc.includes('sleet')) return '🌨️';
  if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
  if (desc.includes('wind')) return '💨';

  return '🌤️'; // default
};

export const getWeatherGradient = (weatherIcon, description) => {
  const icon = weatherIcon || '';
  const desc = (description || '').toLowerCase();
  
  // Extract code from WeatherAPI.com URL
  const codeMatch = icon.match(/\/(\d+)\.png$/);
  const code = codeMatch ? codeMatch[1] : '';

  // Clear/Sunny
  if (code === '113' || desc.includes('clear') || desc.includes('sunny')) {
    return 'from-yellow-400 to-orange-500';
  }
  
  // Partly cloudy
  if (code === '116' || desc.includes('partly cloudy')) {
    return 'from-blue-400 to-gray-500';
  }
  
  // Cloudy/Overcast
  if (code === '119' || code === '122' || desc.includes('cloud') || desc.includes('overcast')) {
    return 'from-gray-400 to-gray-600';
  }
  
  // Rain
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower') || 
      (code >= '293' && code <= '359')) {
    return 'from-blue-500 to-blue-700';
  }
  
  // Thunderstorm
  if (desc.includes('thunder') || desc.includes('storm') || (code >= '386' && code <= '395')) {
    return 'from-purple-500 to-purple-700';
  }
  
  // Snow
  if (desc.includes('snow') || desc.includes('blizzard') || (code >= '323' && code <= '395')) {
    return 'from-cyan-300 to-blue-400';
  }
  
  // Mist/Fog
  if (desc.includes('mist') || desc.includes('fog') || code === '143' || code === '248' || code === '260') {
    return 'from-gray-300 to-gray-500';
  }

  // Default
  return 'from-blue-400 to-blue-600';
};
