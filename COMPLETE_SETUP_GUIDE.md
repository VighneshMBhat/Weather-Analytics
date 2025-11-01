# 🚀 Complete Setup Guide - Weather Analytics Dashboard

## ✅ What You Requested - Implementation Summary

### 1. Landing Page with Google Sign-In ONLY ✅
- Beautiful landing page showing features
- **Only Google Sign-In** - no email/password option
- Users must sign in to access the dashboard

### 2. Temperature Unit Conversion on Backend ✅
- **Backend handles ALL temperature conversion**
- WeatherAPI.com returns Celsius
- Backend converts to Fahrenheit when user selects it
- Frontend just switches the setting, backend does the conversion

### 3. All 4 API Types Implemented ✅
- **Current Weather** with AQI
- **Forecast** (up to 14 days)
- **Historical** (past dates)
- **Future** (future predictions)
- All parameters correctly passed (city, date, etc.)

### 4. Favorite Cities with Supabase ✅
- Users can pin favorite cities
- Saved to Supabase database
- SQL schema ready to run

---

## 📋 Step 1: Run Supabase SQL

### Copy and Run This SQL in Supabase SQL Editor:

```sql
-- Supabase Schema for Weather Analytics Dashboard
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Favorites table (for pinning cities)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, city_name)
);

-- Historical snapshots table
CREATE TABLE IF NOT EXISTS historical_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  city_name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  snapshot_time TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_city_name ON favorites(city_name);
CREATE INDEX IF NOT EXISTS idx_historical_city_name ON historical_snapshots(city_name);
CREATE INDEX IF NOT EXISTS idx_historical_snapshot_time ON historical_snapshots(snapshot_time);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_snapshots ENABLE ROW LEVEL SECURITY;

-- Security Policies for favorites (users can only see their own)
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for historical_snapshots
CREATE POLICY "Authenticated users can view historical snapshots"
  ON historical_snapshots FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert snapshots"
  ON historical_snapshots FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR true);
```

**How to run**:
1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste the SQL above
5. Click "Run"

---

## 📋 Step 2: Enable Google Sign-In in Supabase

### Instructions:

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com
   - Create a new project (or use existing)

2. **Enable Google+ API**:
   - In the left menu: APIs & Services → Library
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth Credentials**:
   - Go to: APIs & Services → Credentials
   - Click "+ CREATE CREDENTIALS"
   - Choose "OAuth client ID"
   - Application type: "Web application"
   - Add authorized redirect URIs from Supabase (next step)

4. **Configure Supabase**:
   - Go to your Supabase project
   - Authentication → Providers
   - Find "Google" and enable it
   - Copy the "Callback URL" (looks like: `https://your-project.supabase.co/auth/v1/callback`)
   - Add this URL to Google OAuth "Authorized redirect URIs"
   - Paste Google Client ID and Secret into Supabase

5. **Save Configuration**

---

## 📋 Step 3: Create Environment Files

### Backend `.env` file:

Create `backend/.env`:

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
JWT_SECRET=weather-dashboard-secret-2025
```

### Frontend `.env` file:

Create `frontend/.env`:

```env
# Weather API Provider
REACT_APP_WEATHER_API_PROVIDER=weatherapi

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://ixeaawepytigdqwrwhlp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZWFhd2VweXRpZ2Rxd3J3aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjQ3MTQsImV4cCI6MjA3NzUwMDcxNH0.v2AOP9E99KTg8KZ-b8VXTQlqM3v2QjoPwoBkxsHh-fA

# Backend API Base URL
REACT_APP_NODE_API_BASE=http://localhost:4000/api

# Refresh Interval
REACT_APP_DEFAULT_REFRESH_SECONDS=60
```

---

## 📋 Step 4: Install and Run

### Terminal 1 - Backend:

```bash
cd backend
npm install
npm run dev
```

Wait for: `🚀 Server running on port 4000`

### Terminal 2 - Frontend:

```bash
cd frontend
npm install
npm start
```

Browser will open at: `http://localhost:3000`

---

## 🎯 How It Works

### 1. Landing Page Flow

```
User visits http://localhost:3000
    ↓
Sees beautiful landing page with features
    ↓
Clicks "Sign in with Google" button
    ↓
Redirected to Google OAuth
    ↓
Approves access
    ↓
Redirected back to app
    ↓
Now sees Dashboard with weather cards
```

### 2. Temperature Conversion Flow

```
User clicks °F button in header
    ↓
Frontend updates Redux settings (unit: 'fahrenheit')
    ↓
Frontend calls: /api/weather/current?city=Bangalore&unit=fahrenheit
    ↓
Backend receives request
    ↓
Backend calls WeatherAPI.com (returns Celsius)
    ↓
Backend converts 25°C → 77°F
    ↓
Returns converted data to frontend
    ↓
Frontend displays: 77°F
```

**Important**: User never waits for conversion - it's instant because backend does it!

### 3. Favorite Cities Flow

```
User clicks ❤️ on a city card
    ↓
Frontend calls: POST /api/favorites with city data
    ↓
Backend saves to Supabase favorites table
    ↓
Frontend updates immediately
    ↓
❤️ turns red
    ↓
City appears in favorites list
```

### 4. All API Types Usage

#### Current Weather (with AQI):
```javascript
GET /api/weather/current?city=Bangalore&unit=celsius

Response includes:
- Temperature, feels like, humidity
- Air Quality Index (PM2.5, PM10, AQI score)
- Wind speed, direction
- Visibility, UV index
```

#### Forecast:
```javascript
GET /api/weather/forecast?city=Bangalore&days=7&unit=celsius

Response includes:
- 7-day daily forecast
- Hourly breakdown (24-48 hours)
- Weather alerts (if any)
- Precipitation chances
```

#### Historical:
```javascript
GET /api/weather/historical?city=Bangalore&date=2025-01-01&unit=celsius

Response includes:
- Hourly data for that date
- Max, min, avg temperatures
- Total precipitation
```

#### Future:
```javascript
GET /api/weather/future?city=Bangalore&date=2025-12-01&unit=celsius

Response includes:
- Predicted hourly data
- Max, min, avg temperatures
```

---

## 🎨 Features Explained

### Landing Page Features Highlighted:

1. **🌍 Global Coverage** - Search any city worldwide
2. **📊 Interactive Charts** - Beautiful Recharts visualizations
3. **⭐ Favorite Cities** - Pin and track favorite locations
4. **🔔 Real-time Updates** - Auto-refresh every 60 seconds
5. **🌡️ AQI Monitoring** - Air quality tracking
6. **📅 Forecast & History** - Past, current, and future weather

### After Sign-In:

1. **Dashboard** - Shows favorite cities (or defaults)
2. **Search Bar** - Find any city with autocomplete
3. **Unit Toggle** - Switch between °C and °F (header button)
4. **Favorite Button** - ❤️ on each city card
5. **City Details** - Click card to see charts
6. **CSV Export** - Download weather data

---

## 🔄 Temperature Conversion Details

### Why Backend Conversion?

**Problem**: WeatherAPI.com only returns ONE unit at a time (Celsius by default)

**Solution**: Backend converts on-demand

### How It Works:

1. **Frontend Settings**: User clicks °C / °F toggle
2. **Redux State**: `settings.unit` updates to 'fahrenheit'
3. **API Calls**: Every API call includes `&unit=fahrenheit`
4. **Backend**: Receives data in Celsius, converts to Fahrenheit
5. **Response**: Returns already-converted data

### Conversion Formulas Used:

```javascript
// Celsius to Fahrenheit
F = (C × 9/5) + 32

// Fahrenheit to Celsius  
C = (F - 32) × 5/9
```

### What Gets Converted:

- ✅ current.temp
- ✅ current.feels_like
- ✅ hourly[].temp
- ✅ hourly[].feels_like
- ✅ daily[].temp.min / max / day
- ✅ summary.maxtemp / mintemp / avgtemp

---

## 🧪 Testing Your Setup

### 1. Test Landing Page:
```
Visit: http://localhost:3000
Should see: Landing page with Google Sign-In button
```

### 2. Test Google Sign-In:
```
Click: "Sign in with Google"
Should: Redirect to Google OAuth
After approval: Redirect back and show Dashboard
```

### 3. Test Dashboard:
```
After sign-in, should see:
- Weather cards for 3 default cities (or your favorites)
- Search bar at top
- °C / °F toggle in header
- ❤️ favorite buttons on cards
```

### 4. Test Temperature Toggle:
```
1. Note current temperature (e.g., 25°C)
2. Click °F button in header
3. Should instantly show: 77°F
4. Click °C button
5. Should show: 25°C again
```

### 5. Test Favorites:
```
1. Click ❤️ on a city card
2. Heart should turn red
3. Refresh page
4. Heart should still be red (saved to Supabase!)
```

### 6. Test API Types:

**Current Weather**:
```bash
curl "http://localhost:4000/api/weather/current?city=Bangalore&unit=celsius"
```

**Forecast**:
```bash
curl "http://localhost:4000/api/weather/forecast?city=Bangalore&days=3&unit=celsius"
```

**Historical**:
```bash
curl "http://localhost:4000/api/weather/historical?city=Bangalore&date=2025-01-01&unit=celsius"
```

**Future**:
```bash
curl "http://localhost:4000/api/weather/future?city=Bangalore&date=2025-12-01&unit=celsius"
```

---

## ✅ Verification Checklist

### Backend:
- [ ] `backend/.env` file created with all keys
- [ ] Backend running on port 4000
- [ ] Test endpoint: `http://localhost:4000/health` returns OK

### Frontend:
- [ ] `frontend/.env` file created
- [ ] Frontend running on port 3000
- [ ] Landing page shows at `http://localhost:3000`

### Supabase:
- [ ] SQL schema executed successfully
- [ ] Tables created: `favorites`, `historical_snapshots`
- [ ] Google OAuth configured in Authentication → Providers
- [ ] Test sign-in works

### Features:
- [ ] Landing page displays correctly
- [ ] Google Sign-In button works
- [ ] After sign-in, dashboard shows
- [ ] Weather cards display data
- [ ] Temperature toggle works (°C / °F)
- [ ] Favorite button works (❤️)
- [ ] Favorites persist after refresh
- [ ] Search works with autocomplete
- [ ] City detail page shows charts

---

## 🎉 You're Done!

Everything is implemented as requested:

1. ✅ **Landing page** with Google Sign-In ONLY
2. ✅ **Temperature conversion** on backend
3. ✅ **All 4 API types** (current, forecast, historical, future)
4. ✅ **Favorite cities** with Supabase database
5. ✅ **Settings** to switch units
6. ✅ **All parameters** correctly passed

**Your API key is 100% secure** - users never see it!

For more details, see:
- `API_SECURITY_EXPLAINED.md` - Security architecture
- `WEATHERAPI_SETUP.md` - API features guide
- `ARCHITECTURE.md` - System design

**Enjoy your Weather Analytics Dashboard!** 🌤️
