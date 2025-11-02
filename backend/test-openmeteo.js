/**
 * Test script to verify Open-Meteo API connection
 * Run with: node test-openmeteo.js
 */

const axios = require('axios');

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

console.log('\n🧪 Testing Open-Meteo API Connection...\n');
console.log('='.repeat(60));
console.log('✅ Open-Meteo is FREE - No API key needed!');
console.log('✅ Base URL:', BASE_URL);
console.log('✅ Geocoding URL:', GEOCODING_URL);
console.log('='.repeat(60));

async function geocodeCity(cityName) {
  try {
    console.log(`\n📍 Geocoding: ${cityName}...`);
    
    const response = await axios.get(`${GEOCODING_URL}/search`, {
      params: {
        name: cityName,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('City not found');
    }

    const city = response.data.results[0];
    console.log('✅ SUCCESS!');
    console.log('   City:', city.name);
    console.log('   Country:', city.country);
    console.log('   Coordinates:', city.latitude, ',', city.longitude);
    
    return city;
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
    return null;
  }
}

async function testCurrentWeather() {
  try {
    console.log('\n📍 Testing: Current Weather for Bangalore...');
    
    const city = await geocodeCity('Bangalore');
    if (!city) return false;

    const url = `${BASE_URL}/forecast`;
    const params = {
      latitude: city.latitude,
      longitude: city.longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'weather_code',
        'wind_speed_10m',
        'pressure_msl',
      ].join(','),
      timezone: 'auto',
    };
    
    console.log('Request URL:', url);
    console.log('Request params:', JSON.stringify(params, null, 2));
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Response data:');
    console.log('   Location:', city.name, ',', city.country);
    console.log('   Temperature:', response.data.current.temperature_2m, '°C');
    console.log('   Feels like:', response.data.current.apparent_temperature, '°C');
    console.log('   Humidity:', response.data.current.relative_humidity_2m, '%');
    console.log('   Wind:', response.data.current.wind_speed_10m, 'km/h');
    console.log('   Pressure:', response.data.current.pressure_msl, 'hPa');
    
    return true;
  } catch (error) {
    console.error('❌ FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testForecast() {
  try {
    console.log('\n📍 Testing: 7-Day Forecast for Mumbai...');
    
    const city = await geocodeCity('Mumbai');
    if (!city) return false;

    const url = `${BASE_URL}/forecast`;
    const params = {
      latitude: city.latitude,
      longitude: city.longitude,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
      ].join(','),
      forecast_days: 7,
      timezone: 'auto',
    };
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Response data:');
    console.log('   Location:', city.name);
    console.log('   Forecast days:', response.data.daily.time.length);
    console.log('   First day:', response.data.daily.time[0]);
    console.log('   Temp range:', response.data.daily.temperature_2m_min[0], '°C to', response.data.daily.temperature_2m_max[0], '°C');
    console.log('   Precipitation:', response.data.daily.precipitation_sum[0], 'mm');
    
    return true;
  } catch (error) {
    console.error('❌ FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testHourlyForecast() {
  try {
    console.log('\n📍 Testing: 24-Hour Forecast for Udupi...');
    
    const city = await geocodeCity('Udupi');
    if (!city) return false;

    const url = `${BASE_URL}/forecast`;
    const params = {
      latitude: city.latitude,
      longitude: city.longitude,
      hourly: [
        'temperature_2m',
        'precipitation_probability',
        'weather_code',
      ].join(','),
      forecast_hours: 24,
      timezone: 'auto',
    };
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Response data:');
    console.log('   Location:', city.name);
    console.log('   Hourly data points:', response.data.hourly.time.length);
    console.log('   First hour:', response.data.hourly.time[0]);
    console.log('   Temperature:', response.data.hourly.temperature_2m[0], '°C');
    console.log('   Rain chance:', response.data.hourly.precipitation_probability[0], '%');
    
    return true;
  } catch (error) {
    console.error('❌ FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testSearch() {
  try {
    console.log('\n📍 Testing: City Search for "Ban"...');
    
    const url = `${GEOCODING_URL}/search`;
    const params = {
      name: 'Ban',
      count: 5,
      language: 'en',
      format: 'json',
    };
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Found cities:', response.data.results ? response.data.results.length : 0);
    if (response.data.results && response.data.results.length > 0) {
      console.log('\n   Search Results:');
      response.data.results.forEach((city, i) => {
        console.log(`   ${i + 1}. ${city.name}, ${city.admin1 || ''} ${city.country}`);
        console.log(`      Coordinates: ${city.latitude}, ${city.longitude}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Starting Open-Meteo API tests...\n');
  
  const test1 = await testCurrentWeather();
  const test2 = await testForecast();
  const test3 = await testHourlyForecast();
  const test4 = await testSearch();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log('   Current Weather:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('   7-Day Forecast:', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('   Hourly Forecast:', test3 ? '✅ PASS' : '❌ FAIL');
  console.log('   City Search:', test4 ? '✅ PASS' : '❌ FAIL');
  console.log('='.repeat(60));
  
  if (test1 && test2 && test3 && test4) {
    console.log('\n✅ All tests passed! Open-Meteo API is working correctly.\n');
    console.log('💡 To use Open-Meteo in your app:');
    console.log('   1. Edit backend/.env');
    console.log('   2. Set: WEATHER_API_PROVIDER=openmeteo');
    console.log('   3. Restart backend: npm run dev\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check your internet connection.\n');
    process.exit(1);
  }
}

runTests();
