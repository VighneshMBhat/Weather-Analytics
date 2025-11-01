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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  if (!process.env.WEATHER_API_KEY) {
    console.warn('⚠️  WEATHER_API_KEY not set in .env file');
  }
  if (!process.env.SUPABASE_URL) {
    console.warn('⚠️  SUPABASE_URL not set in .env file');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
