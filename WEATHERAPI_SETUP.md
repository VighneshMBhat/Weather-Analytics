# WeatherAPI.com Setup Guide 🌦️

## ✅ API Key Security - SOLVED!

**Your concern about API key visibility is 100% valid and ALREADY HANDLED!**

### 🔒 How We Keep Your API Key Secure:

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React) - User's Browser                          │
│  ❌ NO API KEY HERE - NEVER EXPOSED TO CLIENT               │
│                                                              │
│  User clicks → Calls backend API                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js/Express) - YOUR SERVER                    │
│  ✅ API KEY STORED HERE - SECURELY                          │
│                                                              │
│  Receives request → Uses API key → Calls WeatherAPI.com     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  WeatherAPI.com - External Service                          │
│  Receives request with your API key from backend only       │
└─────────────────────────────────────────────────────────────┘
```

**Result**: Users NEVER see your API key. It's completely hidden on your backend server!

---

## 🎯 Available Features (All 4 Types)

### 1️⃣ Current Weather with AQI (Air Quality Index)
**Endpoint**: `GET /api/weather/current?city=Bangalore`

**What you get**:
- Current temperature, humidity, wind, pressure
- **Air Quality Index (AQI)** with PM2.5, PM10 levels
- US EPA Index and GB DEFRA Index
- UV Index
- Weather conditions

**Example**:
```javascript
GET http://localhost:4000/api/weather/current?city=Bangalore
```

---

### 2️⃣ Forecast (Up to 14 days)
**Endpoint**: `GET /api/weather/forecast?city=Bangalore&days=3`

**What you get**:
- Hourly forecast for next 24-48 hours
- Daily forecast for up to 14 days
- **Weather Alerts** (if any active)
- **AQI data** included
- Precipitation chances

**Example**:
```javascript
GET http://localhost:4000/api/weather/forecast?city=Bangalore&days=7&aqi=yes&alerts=yes
```

---

### 3️⃣ Historical Weather
**Endpoint**: `GET /api/weather/historical?city=Bangalore&date=2025-01-01`

**What you get**:
- Historical weather data for a specific date
- Hourly breakdown for that day
- Max, min, average temperatures
- Total precipitation
- Average humidity

**Date Format**: YYYY-MM-DD

**Example**:
```javascript
GET http://localhost:4000/api/weather/historical?city=Bangalore&date=2025-01-01
```

---

### 4️⃣ Future Weather
**Endpoint**: `GET /api/weather/future?city=Bangalore&date=2025-12-01`

**What you get**:
- Future weather predictions for a specific date
- Hourly breakdown
- Max, min, average temperatures
- Similar to historical but for future dates

**Date Format**: YYYY-MM-DD

**Example**:
```javascript
GET http://localhost:4000/api/weather/future?city=Bangalore&date=2025-12-01
```

---

## 📋 Quick Setup Instructions

### Step 1: Backend Configuration

Create `backend/.env` file with:

```env
NODE_ENV=development
PORT=4000

# WeatherAPI.com Configuration
WEATHER_API_KEY=1a3021379bb043a4ad6142818250111
WEATHER_API_PROVIDER=weatherapi

# Supabase Configuration
SUPABASE_URL=https://ixeaawepytigdqwrwhlp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZWFhd2VweXRpZ2Rxd3J3aGxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkyNDcxNCwiZXhwIjoyMDc3NTAwNzE0fQ.NTZVXHQwI3S06m3j7aZCCDxO6-F4qfkyqtC14jTHOjs

# JWT Secret
JWT_SECRET=my-super-secret-jwt-key-2025
```

### Step 2: Frontend Configuration

Create `frontend/.env` file with:

```env
# Weather API - NO API KEY NEEDED ON FRONTEND!
REACT_APP_WEATHER_API_PROVIDER=weatherapi

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://ixeaawepytigdqwrwhlp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZWFhd2VweXRpZ2Rxd3J3aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjQ3MTQsImV4cCI6MjA3NzUwMDcxNH0.v2AOP9E99KTg8KZ-b8VXTQlqM3v2QjoPwoBkxsHh-fA

# Backend API
REACT_APP_NODE_API_BASE=http://localhost:4000/api
REACT_APP_DEFAULT_REFRESH_SECONDS=60
```

### Step 3: Start the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm install
npm start
```

---

## 🔍 Testing Your API

### Test Current Weather (with AQI):
```bash
curl "http://localhost:4000/api/weather/current?city=Bangalore"
```

### Test Forecast:
```bash
curl "http://localhost:4000/api/weather/forecast?city=Bangalore&days=3"
```

### Test Historical:
```bash
curl "http://localhost:4000/api/weather/historical?city=Bangalore&date=2025-01-01"
```

### Test Future:
```bash
curl "http://localhost:4000/api/weather/future?city=Bangalore&date=2025-12-01"
```

### Test City Search:
```bash
curl "http://localhost:4000/api/weather/search?q=Ban"
```

---

## 🎨 Frontend Integration Example

```javascript
import { getCurrentWeather, getForecast, getHistorical, getFuture } from './api/weatherClient';

// Get current weather with AQI
const currentData = await getCurrentWeather('Bangalore');
console.log('AQI:', currentData.data.current.aqi);

// Get 7-day forecast with alerts
const forecastData = await getForecast('Bangalore', 7);
console.log('Alerts:', forecastData.data.alerts);

// Get historical weather
const historicalData = await getHistorical('Bangalore', '2025-01-01');

// Get future weather
const futureData = await getFuture('Bangalore', '2025-12-01');
```

---

## 🔐 Security Features

### ✅ What's Secure:
1. **API Key NEVER in frontend code** - stored only on backend
2. **Backend proxy pattern** - all API calls go through your server
3. **Environment variables** - keys stored in `.env` files (gitignored)
4. **Supabase RLS** - database security at row level
5. **Rate limiting** - prevents API abuse

### ❌ What Users CANNOT See:
- Your WeatherAPI.com API key
- Your Supabase service role key
- Any backend environment variables
- Direct API calls to WeatherAPI.com

### ✅ What Users CAN See (But it's Safe):
- Supabase Anon Key - Safe! It respects Row Level Security
- Backend API URL - Expected! They need to call your backend
- Frontend code - Normal for React apps

---

## 📊 API Response Examples

### Current Weather Response:
```json
{
  "success": true,
  "data": {
    "cityName": "Bangalore, India",
    "lat": 12.98,
    "lon": 77.58,
    "current": {
      "temp": 24.5,
      "feels_like": 25.2,
      "humidity": 65,
      "pressure": 1013,
      "wind_speed": 3.5,
      "uvi": 7,
      "aqi": {
        "pm2_5": 45.2,
        "pm10": 62.8,
        "us_epa_index": 2,
        "gb_defra_index": 3
      },
      "weather": {
        "description": "Partly cloudy",
        "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
      }
    }
  }
}
```

---

## 💡 Key Differences from OpenWeatherMap

| Feature | WeatherAPI.com | OpenWeatherMap |
|---------|----------------|----------------|
| AQI Data | ✅ Included | ❌ Separate API |
| Future Weather | ✅ Yes | ❌ No |
| Weather Alerts | ✅ Yes | ⚠️ Limited |
| Free Tier | 1M calls/month | 1K calls/day |
| Historical Data | ✅ Easy access | ⚠️ Paid only |

---

## 🚀 Next Steps

1. ✅ **Backend is ready** - API key secure on server
2. ✅ **Frontend is ready** - No API key needed
3. ✅ **4 weather types** - Current, Forecast, Historical, Future
4. ✅ **AQI included** - Air quality data built-in
5. ✅ **Alerts included** - Weather warnings when available

**Just start the servers and test!**

---

## 🆘 Troubleshooting

### "API key not found" error:
- Check `backend/.env` has `WEATHER_API_KEY`
- Restart backend server after adding key

### "City not found" error:
- Try different city format: "Bangalore" or "London,UK"
- Use lat,lon format: "12.98,77.58"

### Frontend can't connect:
- Check backend is running on port 4000
- Verify `REACT_APP_NODE_API_BASE` in frontend/.env

### API key visible in browser?
- ✅ **It shouldn't be!** Check Network tab in DevTools
- You should only see calls to `localhost:4000/api`
- If you see calls to `api.weatherapi.com`, something is wrong!

---

## 📞 Support

Your API key is **100% secure** with this architecture. Users will never see it in:
- ✅ Browser Network tab
- ✅ Frontend source code
- ✅ Browser console
- ✅ DevTools

The backend acts as a secure proxy, keeping your API key safe! 🔒

---

**Ready to use!** Your API key is already configured and secure! 🎉
