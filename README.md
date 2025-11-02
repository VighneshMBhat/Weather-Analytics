# Weather Analytics Dashboard 🌤️

A production-ready Weather Analytics Dashboard with real-time updates, interactive charts, and persistent favorites.

## Features ✨

- **Real-time Weather Data**: Updates every 60 seconds with current conditions
- **Free Weather API**: Uses Open-Meteo (no API key required!)
- **Interactive Charts**: Temperature, precipitation, and wind speed visualizations using Recharts
- **Favorites Management**: Save favorite cities (synced to Supabase when authenticated)
- **Google Sign-In**: Authentication powered by Supabase Auth
- **Responsive Design**: Beautiful UI with Tailwind CSS and Framer Motion animations
- **Dark/Light Mode**: System-aware theme switching
- **Smart Caching**: Backend caching with 60s TTL to reduce API calls
- **Rate Limiting**: Protection against API abuse
- **Unit Toggle**: Switch between Celsius/Fahrenheit instantly
- **CSV Export**: Download weather data for analysis
- **City Search**: Autocomplete search with geocoding

## Why Open-Meteo? 🌍

This project uses **Open-Meteo** as the weather data provider instead of commercial APIs like OpenWeatherMap. Here's why:

✅ **Completely Free** - No API key required, no credit card, no sign-up  
✅ **No Rate Limits** - Unlimited requests on the free tier  
✅ **High Quality Data** - Weather data from national weather services (NOAA, DWD, etc.)  
✅ **Global Coverage** - 11 km resolution worldwide, 1 km for Europe  
✅ **Open Source** - Built for the open-source community  
✅ **No Vendor Lock-in** - Easy to get started without registration  

**Perfect for:**
- Learning projects
- Hackathons
- MVPs and prototypes
- Production apps with reasonable traffic

Learn more: [https://open-meteo.com](https://open-meteo.com)

## Tech Stack 🛠️

### Frontend
- React 18 (Hooks & Functional Components)
- Redux Toolkit for state management
- React Router v6 for routing
- Tailwind CSS for styling
- Recharts for data visualization
- Framer Motion for animations
- Supabase for authentication & database

### Backend
- Node.js + Express
- In-memory caching (node-cache) with request coalescing
- Rate limiting (express-rate-limit)
- Supabase integration for storage
- Open-Meteo API integration (free, no API key required)

## Project Structure 📁

```
weather-project/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── weather.js
│   │   │   └── favorites.js
│   │   ├── services/
│   │   │   ├── weatherService.js
│   │   │   └── supabaseService.js
│   │   ├── middleware/
│   │   │   └── rateLimit.js
│   │   ├── cache.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── weatherClient.js
│   │   │   └── supabaseClient.js
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── features/
│   │   │   ├── auth/authSlice.js
│   │   │   ├── weather/weatherSlice.js
│   │   │   ├── favorites/favoritesSlice.js
│   │   │   └── settings/settingsSlice.js
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CityCard.jsx
│   │   │   ├── CityDetail.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FavoriteButton.jsx
│   │   │   └── Charts/
│   │   ├── hooks/
│   │   │   ├── usePolling.js
│   │   │   └── useLocalStorage.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
├── supabase-schema.sql
└── README.md
```

## Setup Instructions 🚀

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier: https://supabase.com)
- No weather API key needed! (using Open-Meteo free tier)

### 1. Clone the Repository

git clone https://github.com/VighneshMBhat/Weather-Analytics.git

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
NODE_ENV=development
PORT=4000
WEATHER_API_PROVIDER=openmeteo
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**✨ Note:** Open-Meteo is completely free and requires NO API key!
- Uses Open-Meteo API: https://open-meteo.com
- No sign-up required
- No rate limits on free tier
- High-quality weather data from national weather services

Start the backend:

```bash
npm run dev
```

Backend will run on http://localhost:4000

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
REACT_APP_WEATHER_API_PROVIDER=openmeteo
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_NODE_API_BASE=http://localhost:4000/api
REACT_APP_DEFAULT_REFRESH_SECONDS=60
```

Start the frontend:

```bash
npm start
```

Frontend will run on http://localhost:3000

### 4. Supabase Setup

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Wait for the database to be provisioned

2. **Run Database Schema**
   - Open the SQL Editor in Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Run the SQL to create tables and policies

3. **Enable Google Sign-In**
   - Go to Authentication > Providers in Supabase
   - Enable Google provider
   - Add your Google OAuth credentials (from Google Cloud Console)
   - Add authorized redirect URLs

4. **Get Your Keys**
   - Go to Settings > API
   - Copy the Project URL (SUPABASE_URL)
   - Copy the anon/public key (SUPABASE_ANON_KEY for frontend)
   - Copy the service_role key (SUPABASE_SERVICE_ROLE_KEY for backend)

## API Endpoints 📡

### Weather Endpoints

- `GET /api/weather/current?city=<city>` - Get current weather
- `GET /api/weather/forecast?city=<city>&days=7` - Get 7-day forecast
- `GET /api/weather/hourly?city=<city>&hours=24` - Get hourly forecast
- `GET /api/weather/historical?city=<city>&from=<date>&to=<date>` - Get historical data
- `GET /api/weather/search?q=<query>&limit=5` - Search cities (autocomplete)

### Favorites Endpoints (Protected)

- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add favorite city
- `DELETE /api/favorites/:cityName` - Remove favorite city

### Health Check

- `GET /health` - Server health status

## Usage Guide 📖

### Dashboard

1. **View Weather**: The dashboard shows weather for default cities or your favorites
2. **Search Cities**: Use the search bar to find any city worldwide
3. **Add Favorites**: Click the heart icon on any city card to add to favorites
4. **Unit Toggle**: Click the °C/°F button in the header to switch units
5. **Auto-refresh**: Weather data updates automatically every 60 seconds

### City Detail Page

1. **Click any city card** to view detailed information
2. **View Charts**: See 24-hour and 7-day forecasts with interactive charts
3. **Download Data**: Click "Download CSV" to export chart data
4. **Add to Favorites**: Click the heart icon to save the city

### Authentication

1. Click "Sign In" in the header
2. Sign in with Google (redirects to Google OAuth)
3. Your favorites will sync across devices when signed in
4. For guests, favorites are stored in localStorage

## Features Explained 🎯

### Real-time Updates

- Frontend polls the backend every 60 seconds for current weather
- Backend caches responses for 60 seconds to minimize API calls
- Polling automatically pauses when the browser tab is hidden

### Smart Caching

- In-memory cache with 60s TTL on backend
- Request coalescing: duplicate concurrent requests share the same API call
- Geocoding results cached for 5 minutes
- For production, consider Redis for distributed caching

### Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Weather endpoints: 30 requests per minute per IP
- Auth endpoints: 5 requests per 15 minutes per IP

### Historical Data

- Backend samples 10% of weather requests and saves to Supabase
- Use the historical endpoint to query past weather data
- Useful for trend analysis and data visualization

## Production Deployment 🚢

### Backend Deployment

1. Set `NODE_ENV=production` in .env
2. Deploy to services like:
   - Railway
   - Heroku
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to:
   - Vercel
   - Netlify
   - Cloudflare Pages
   - AWS S3 + CloudFront

3. Update environment variables in deployment platform
4. Update `REACT_APP_NODE_API_BASE` to point to production backend URL

### Environment Variables Checklist

**Backend:**
- ✅ WEATHER_API_PROVIDER=openmeteo
- ✅ OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ NODE_ENV=production
- ✅ PORT

**Frontend:**
- ✅ REACT_APP_WEATHER_API_PROVIDER=openmeteo
- ✅ REACT_APP_SUPABASE_URL
- ✅ REACT_APP_SUPABASE_ANON_KEY
- ✅ REACT_APP_NODE_API_BASE (production backend URL)

## Security Notes 🔒

- **Never expose SUPABASE_SERVICE_ROLE_KEY to frontend**
- Service role key is only used on backend for admin operations
- Frontend uses SUPABASE_ANON_KEY which respects Row Level Security policies
- All favorites endpoints require authentication
- Rate limiting prevents API abuse
- Input validation prevents injection attacks

## Troubleshooting 🔧

### Common Issues

1. **"City not found" error**
   - Ensure Open-Meteo API is accessible (check network connection)
   - Try searching with a different city name format

2. **Favorites not syncing**
   - Verify Supabase credentials are correct
   - Check if Google OAuth is properly configured
   - Ensure database schema is created

3. **CORS errors**
   - Backend CORS is configured for development
   - For production, update CORS origin in `server.js`

4. **Charts not displaying**
   - Ensure forecast data is available
   - Check browser console for errors
   - Verify Recharts is installed

### Debug Mode

Enable detailed logging by setting in browser console:

```javascript
localStorage.setItem('debug', 'weather:*');
```

## License 📄

MIT License - feel free to use this project for learning or production!

## Credits 🙏

- Weather data: [Open-Meteo](https://open-meteo.com/) - Free weather API
- Geocoding: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- Authentication & Database: [Supabase](https://supabase.com/)
- Icons: Emoji (native)
- Charts: [Recharts](https://recharts.org/)
- Animations: [Framer Motion](https://www.framer.com/motion/)

## Support 💬

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using React, Node.js, and Supabase
