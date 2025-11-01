# 🚀 Setup Your .env Files NOW

## ⚡ Quick 2-Minute Setup

Your credentials are ready! Just create these two files:

---

## 1️⃣ Backend Environment File

**File Location**: `backend/.env`

**Copy this EXACTLY**:

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

---

## 2️⃣ Frontend Environment File

**File Location**: `frontend/.env`

**Copy this EXACTLY**:

```env
# Weather API Provider
REACT_APP_WEATHER_API_PROVIDER=weatherapi

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://ixeaawepytigdqwrwhlp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZWFhd2VweXRpZ2Rxd3J3aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MjQ3MTQsImV4cCI6MjA3NzUwMDcxNH0.v2AOP9E99KTg8KZ-b8VXTQlqM3v2QjoPwoBkxsHh-fA

# Backend API
REACT_APP_NODE_API_BASE=http://localhost:4000/api

# Refresh interval
REACT_APP_DEFAULT_REFRESH_SECONDS=60
```

---

## 3️⃣ Start the Application

### Option A: Manual Start (Recommended for first time)

**Terminal 1 - Backend**:
```bash
cd backend
npm install
npm run dev
```

Wait for: `🚀 Server running on port 4000`

**Terminal 2 - Frontend**:
```bash
cd frontend  
npm install
npm start
```

Browser will open automatically at: `http://localhost:3000`

---

### Option B: Quick Commands

If you already installed dependencies:

```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm start
```

---

## ✅ Verify It's Working

### 1. Check Backend:
Visit: http://localhost:4000/health

Should see:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T...",
  "environment": "development"
}
```

### 2. Test Weather API:
Visit: http://localhost:4000/api/weather/current?city=Bangalore

Should see weather data with AQI!

### 3. Check Frontend:
Visit: http://localhost:3000

Should see:
- Dashboard with 3 default cities
- Weather cards with current data
- Search bar at top
- Temperature toggle (°C/°F)

---

## 🎯 All 4 Weather Types Available

Once running, test these in your browser:

1. **Current Weather with AQI**:
   ```
   http://localhost:4000/api/weather/current?city=Bangalore
   ```

2. **Forecast (3 days)**:
   ```
   http://localhost:4000/api/weather/forecast?city=Bangalore&days=3
   ```

3. **Historical (specific date)**:
   ```
   http://localhost:4000/api/weather/historical?city=Bangalore&date=2025-01-01
   ```

4. **Future (specific date)**:
   ```
   http://localhost:4000/api/weather/future?city=Bangalore&date=2025-12-01
   ```

---

## 🔒 Security Confirmation

✅ **Your API key is SECURE!**

Open browser DevTools → Network tab → You'll see:
- ✅ Calls to `localhost:4000/api/weather/*` (Your backend)
- ❌ NO calls to `api.weatherapi.com` (Hidden from frontend!)

**This proves your API key is secure on the backend!**

---

## 🆘 If Something Goes Wrong

### Backend won't start:
- Make sure `backend/.env` exists
- Check port 4000 isn't already in use
- Try: `cd backend && npm install` again

### Frontend shows errors:
- Make sure `frontend/.env` exists
- Make sure backend is running first
- Clear browser cache and reload

### "City not found":
- Try different city names: "London", "New York", "Tokyo"
- Use coordinates: "12.98,77.58"

### Can't see weather data:
- Check browser console for errors
- Verify both servers are running
- Check backend logs for errors

---

## 🎉 You're Done!

Both `.env` files are configured with your credentials:
- ✅ WeatherAPI.com key: Ready
- ✅ Supabase URL: Ready  
- ✅ Supabase Keys: Ready
- ✅ Security: API key hidden from users

**Just start both servers and enjoy!** 🚀

---

## 📚 Next: Explore Features

See `WEATHERAPI_SETUP.md` for:
- How to use all 4 weather types
- AQI (Air Quality) data
- Weather alerts
- City search
- Frontend integration examples

---

**Your API key is 100% secure with this setup!** 🔐
