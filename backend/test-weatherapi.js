/**
 * Test script to verify WeatherAPI.com connection
 * Run with: node test-weatherapi.js
 */

require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

console.log('\n🧪 Testing WeatherAPI.com Connection...\n');
console.log('='.repeat(60));

// Check if API key is loaded
if (!API_KEY) {
  console.error('❌ ERROR: WEATHER_API_KEY not found in .env file!');
  console.error('Please create backend/.env file with:');
  console.error('WEATHER_API_KEY=1a3021379bb043a4ad6142818250111');
  process.exit(1);
}

console.log('✅ API Key found:', API_KEY.substring(0, 8) + '...' + API_KEY.substring(API_KEY.length - 4));
console.log('✅ Base URL:', BASE_URL);
console.log('='.repeat(60));

async function testCurrentWeather() {
  try {
    console.log('\n📍 Testing: Current Weather for London...');
    
    const url = `${BASE_URL}/current.json`;
    const params = {
      key: API_KEY,
      q: 'London',
      aqi: 'yes',
    };
    
    console.log('Request URL:', url);
    console.log('Request params:', { ...params, key: params.key.substring(0, 8) + '...' });
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Response data:');
    console.log('   Location:', response.data.location.name, ',', response.data.location.country);
    console.log('   Temperature:', response.data.current.temp_c, '°C');
    console.log('   Condition:', response.data.current.condition.text);
    console.log('   AQI:', response.data.current.air_quality?.['us-epa-index'] || 'N/A');
    
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
    console.log('\n📍 Testing: 3-Day Forecast for New York...');
    
    const url = `${BASE_URL}/forecast.json`;
    const params = {
      key: API_KEY,
      q: 'New York',
      days: 3,
      aqi: 'yes',
      alerts: 'yes',
    };
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Response data:');
    console.log('   Location:', response.data.location.name);
    console.log('   Forecast days:', response.data.forecast.forecastday.length);
    console.log('   First day temp:', response.data.forecast.forecastday[0].day.avgtemp_c, '°C');
    
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
    
    const url = `${BASE_URL}/search.json`;
    const params = {
      key: API_KEY,
      q: 'Ban',
    };
    
    const response = await axios.get(url, { params });
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('📊 Found cities:', response.data.length);
    if (response.data.length > 0) {
      console.log('   First result:', response.data[0].name, ',', response.data[0].country);
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
  console.log('\n🚀 Starting tests...\n');
  
  const test1 = await testCurrentWeather();
  const test2 = await testForecast();
  const test3 = await testSearch();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log('   Current Weather:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('   Forecast:', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('   Search:', test3 ? '✅ PASS' : '❌ FAIL');
  console.log('='.repeat(60));
  
  if (test1 && test2 && test3) {
    console.log('\n✅ All tests passed! WeatherAPI.com is working correctly.\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check your API key and internet connection.\n');
    process.exit(1);
  }
}

runTests();
