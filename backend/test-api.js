const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing London...');
    const response = await axios.get('http://localhost:4000/api/weather/current', {
      params: { city: 'London' }
    });
    console.log('✅ SUCCESS:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ FAILED:', error.response?.data || error.message);
  }
}

testAPI();
