# Quick Start Guide 🚀

Get the Weather Analytics Dashboard running in 5 minutes!

## Step 1: Get Your API Keys

### OpenWeatherMap API Key
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Subscribe to "One Call API 3.0" (free tier available)
4. Copy your API key from the dashboard

### Supabase Setup (Optional but recommended for full features)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > API and copy:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)

## Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and add your API key:
```env
WEATHER_API_KEY=your_openweathermap_api_key_here
```

If you have Supabase, also add:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

```bash
# Start backend server
npm run dev
```

✅ Backend should now be running on http://localhost:4000

## Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key_here
REACT_APP_NODE_API_BASE=http://localhost:4000/api
```

If you have Supabase, also add:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Start frontend
npm start
```

✅ Frontend should open automatically at http://localhost:3000

## Step 4: (Optional) Setup Supabase Database

If you added Supabase credentials:

1. Open Supabase Dashboard > SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL
4. Enable Google Sign-In in Authentication > Providers

## That's it! 🎉

You should now see:
- Dashboard with weather for 3 default cities
- Search bar to find any city
- Click any city to see detailed charts
- Toggle between °C and °F in the header

## Troubleshooting

**"City not found" or no data showing?**
- Check that your OpenWeatherMap API key is valid
- Make sure you subscribed to One Call API 3.0 (it's free!)
- Wait a few minutes after creating the API key (it takes time to activate)

**Backend won't start?**
- Check if port 4000 is already in use
- Change PORT in backend/.env if needed

**Frontend won't start?**
- Check if port 3000 is already in use
- Try running: `npm start -- --port 3001`

**Can't sign in?**
- Sign-in requires Supabase setup
- Without Supabase, you can still use all features (favorites saved locally)

## Next Steps

- Add your favorite cities using the heart icon
- Explore the detailed charts on city pages
- Download weather data as CSV
- Sign in with Google to sync favorites across devices

Need help? Check the full README.md for detailed documentation.
