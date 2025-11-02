require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter, weatherLimiter } = require('./middleware/rateLimit');
const weatherRoutes = require('./routes/weather');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/weather/', weatherLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoritesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Weather Analytics Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      weather: {
        current: '/api/weather/current?city=<city>',
        forecast: '/api/weather/forecast?city=<city>&days=7',
        hourly: '/api/weather/hourly?city=<city>&hours=24',
        historical: '/api/weather/historical?city=<city>&from=<date>&to=<date>',
        search: '/api/weather/search?q=<query>&limit=5',
      },
      favorites: {
        get: 'GET /api/favorites',
        add: 'POST /api/favorites',
        remove: 'DELETE /api/favorites/:cityName',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(60));
  
  console.log('\n📋 Environment Variables Check:');
  console.log('✅ PORT:', PORT);
  console.log('✅ NODE_ENV:', NODE_ENV);
  
  const provider = process.env.WEATHER_API_PROVIDER || 'openmeteo';
  
  // Only check for API key if using weatherapi provider
  if (provider === 'weatherapi') {
    if (process.env.WEATHER_API_KEY) {
      console.log('✅ WEATHER_API_KEY:', process.env.WEATHER_API_KEY.substring(0, 8) + '...' + process.env.WEATHER_API_KEY.substring(process.env.WEATHER_API_KEY.length - 4));
    } else {
      console.error('❌ WEATHER_API_KEY not set in .env file (required for WeatherAPI.com)!');
    }
  } else if (provider === 'openmeteo') {
    console.log('✅ Using Open-Meteo: No API key needed!');
  }
  
  if (process.env.SUPABASE_URL) {
    console.log('✅ SUPABASE_URL:', process.env.SUPABASE_URL);
  } else {
    console.error('❌ SUPABASE_URL not set in .env file!');
  }
  
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY: Set (' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ' chars)');
  } else {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set in .env file!');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🧪 Test weather API: curl "http://localhost:' + PORT + '/api/weather/current?city=London"');
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
