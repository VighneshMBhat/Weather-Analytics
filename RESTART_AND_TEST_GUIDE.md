# 🚀 Restart and Test Guide

## ✅ All Fixes Applied:

### **Fix #1: City Cards Showing NaN** ✅
- Fixed: `frontend/src/api/weatherClient.js` (7 functions)
- Fixed: `frontend/src/features/weather/weatherSlice.js` (3 thunks)

### **Fix #2: Search Autocomplete Not Working** ✅
- Fixed: `frontend/src/components/SearchBar.jsx`

---

## 🔄 CRITICAL: You Must Restart Frontend!

The fixes are in the code, but **the old code is still running**. You must restart!

### **Step 1: Stop Frontend**
In your terminal where frontend is running:
```bash
# Press Ctrl+C to stop the server
```

### **Step 2: Start Frontend Again**
```bash
cd frontend
npm start
```

### **Step 3: Hard Refresh Browser**
- **Open**: `http://localhost:3000`
- **Press**: `Ctrl + Shift + R` (hard refresh to clear cache)

---

## 🧪 Test #1: City Cards (Dashboard)

### **Expected Result**:
After restart, the 3 default city cards should show:

| City | Expected |
|------|----------|
| New York, US | ~15°C (59°F) |
| London, GB | ~12°C (54°F) |
| Tokyo, JP | ~18°C (64°F) |

### **✅ Success Indicators**:
- ✅ Real temperatures displayed (not NaN)
- ✅ Humidity: 60% (not just "%")
- ✅ Wind: 15 km/h (not "NaN km/h")
- ✅ Pressure: 1013 hPa (not just "hPa")

### **❌ If Still Showing NaN**:
1. Did you restart frontend? (Ctrl+C → npm start)
2. Did you hard refresh browser? (Ctrl+Shift+R)
3. Check browser console (F12) for errors

---

## 🧪 Test #2: Search Autocomplete

### **Steps**:
1. Click in the search box
2. Type: **"udupi"** (at least 2 characters)
3. Wait 0.5 seconds

### **Expected Result**:
A dropdown should appear showing:
```
┌────────────────────────────────────────┐
│ Udupi, Karnataka, India               │
│ 13.34, 74.75                          │
├────────────────────────────────────────┤
│ (other matching cities...)             │
└────────────────────────────────────────┘
```

### **✅ Success Indicators**:
- ✅ Dropdown appears after typing
- ✅ Shows city names with location
- ✅ Shows lat/lon coordinates
- ✅ Can click on a city
- ✅ Clicking navigates to city detail page

### **❌ If Dropdown Doesn't Appear**:
1. Check browser console (F12) for errors
2. Check Network tab - should see: `GET /api/weather/search?q=udupi`
3. Check if backend is running (port 4000)

---

## 🧪 Test #3: City Detail Page

### **Steps**:
1. Search for "Bangalore"
2. Click on "Bangalore, Karnataka, India" in dropdown
3. Should navigate to: `localhost:3000/city/Bangalore,%20Karnataka,%20India`

### **Expected Result**:
City detail page should show:

```
┌─────────────────────────────────────────────┐
│ Bangalore, Karnataka, India                │
│                                             │
│ 25°C                          ☀️           │
│ Feels like 26°C                            │
│                                             │
│ 💧 Humidity: 60%      🌡️ Pressure: 1013 hPa│
│ 💨 Wind: 15 km/h      ☀️ UV Index: 5.0     │
│ 🌅 Sunrise: 6:30 AM   🌇 Sunset: 6:45 PM   │
└─────────────────────────────────────────────┘

[24-Hour Temperature Chart]
[7-Day Forecast Chart]
[Precipitation Chart]
```

### **✅ Success Indicators**:
- ✅ Temperature: 20-30°C (realistic)
- ✅ All fields populated (no NaN, no "Invalid Date")
- ✅ Charts show realistic values (not 88°C!)
- ✅ Fahrenheit switch works: 68-86°F

---

## 🐛 Common Issues:

### **Issue #1: "Cannot GET /api/weather/search"**
**Problem**: Backend not running

**Solution**:
```bash
cd backend
npm run dev
# Should show: 🚀 Server running on port 4000
```

### **Issue #2: Search shows spinner forever**
**Problem**: Backend search endpoint error

**Solution**: Check backend terminal for errors:
```bash
# Should see:
✅ Weather API Key loaded: 1a302137...0111
```

If missing, check `backend/.env` file exists with:
```env
WEATHER_API_KEY=1a3021379bb043a4ad6142818250111
```

### **Issue #3: Search dropdown empty**
**Problem**: No cities found OR data format mismatch

**Debug**:
1. Open browser console (F12)
2. Type "udupi" in search
3. Check console for: `Search results: [...]`
4. Should show array of city objects

### **Issue #4: Still showing NaN after restart**
**Problem**: Browser cached old code

**Solution**:
1. Close browser completely
2. Reopen browser
3. Go to `localhost:3000`
4. Press Ctrl+Shift+R

---

## 📊 Backend API Test

If search still doesn't work, test backend directly:

### **Windows PowerShell**:
```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/weather/search?q=udupi" | Select-Object -Expand Content
```

### **Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "name": "Udupi",
      "country": "India",
      "region": "Karnataka",
      "lat": 13.34,
      "lon": 74.75,
      "displayName": "Udupi, Karnataka, India"
    }
  ]
}
```

### **If Error**:
```json
{
  "success": false,
  "error": "Query must be at least 2 characters"
}
```

---

## 🎯 Final Checklist:

Before testing, ensure:
- [ ] Backend running on port 4000
- [ ] Backend shows: ✅ Weather API Key loaded
- [ ] Frontend restarted (Ctrl+C → npm start)
- [ ] Browser hard refreshed (Ctrl+Shift+R)
- [ ] Browser console open (F12) to see debug logs

After testing, you should have:
- [ ] City cards show real temperatures (not NaN)
- [ ] Search autocomplete shows dropdown
- [ ] Can click search results to navigate
- [ ] City detail page shows all data correctly
- [ ] Charts show realistic values
- [ ] Fahrenheit conversion works

---

## 🔍 Debug Logs

### **Search Debug Log** (in browser console):
When you type in search, you should see:
```javascript
Search results: [
  {
    name: "Udupi",
    country: "India",
    region: "Karnataka",
    lat: 13.34,
    lon: 74.75,
    displayName: "Udupi, Karnataka, India"
  }
]
```

### **If You See**:
```javascript
Search results: { success: true, data: [...] }
```
**Problem**: weatherClient.js fix not applied or frontend not restarted!

---

## 🚀 Quick Test Command:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (stop and restart)
cd frontend
# Press Ctrl+C
npm start

# Browser
# Press Ctrl+Shift+R
# Test search: "udupi"
```

---

## ✅ Success Summary:

If all works:
1. ✅ Dashboard shows 3 cities with real weather data
2. ✅ Search box shows dropdown with city suggestions
3. ✅ Can click city to view detail page
4. ✅ Detail page shows all weather data correctly
5. ✅ Charts display realistic temperatures
6. ✅ Temperature unit switching works

**All fixed!** 🎉

---

**Need help?** Check:
- Browser console (F12) for errors
- Backend terminal for API errors
- Network tab (F12) to see API responses
