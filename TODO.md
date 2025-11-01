# TODO: Setup Checklist ✅

## Before You Start

- [ ] Read `QUICKSTART.md` for fastest setup
- [ ] Read `README.md` for comprehensive documentation

## Required Setup Steps

### 1. Get API Keys

- [ ] **OpenWeatherMap API Key** (Required)
  - Sign up at https://openweathermap.org/api
  - Subscribe to "One Call API 3.0" (free tier available)
  - Copy your API key
  - ⏰ **Note**: API keys may take 10-15 minutes to activate

- [ ] **Supabase Account** (Optional - recommended for full features)
  - Create account at https://supabase.com
  - Create a new project
  - Copy Project URL, Anon Key, and Service Role Key

### 2. Backend Configuration

- [ ] Navigate to `backend/` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add your `WEATHER_API_KEY` to `.env`
- [ ] If using Supabase, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Run `npm run dev` to start backend server
- [ ] Verify backend is running at http://localhost:4000

### 3. Frontend Configuration

- [ ] Navigate to `frontend/` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add your `WEATHER_API_KEY` to `.env`
- [ ] Set `REACT_APP_NODE_API_BASE=http://localhost:4000/api`
- [ ] If using Supabase, add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- [ ] Run `npm start` to start frontend
- [ ] Verify frontend opens at http://localhost:3000

### 4. Supabase Database Setup (If Using Supabase)

- [ ] Open Supabase Dashboard > SQL Editor
- [ ] Copy contents of `supabase-schema.sql`
- [ ] Run the SQL to create tables and security policies
- [ ] Verify tables `favorites` and `historical_snapshots` are created

### 5. Google Sign-In Setup (If Using Supabase)

- [ ] Go to Google Cloud Console (https://console.cloud.google.com)
- [ ] Create a new project or use existing
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URIs from Supabase
- [ ] Go to Supabase Dashboard > Authentication > Providers
- [ ] Enable Google provider
- [ ] Add your Google OAuth Client ID and Secret
- [ ] Test sign-in flow

## Testing Checklist

- [ ] Backend health check: Visit http://localhost:4000/health
- [ ] Frontend loads successfully
- [ ] Can see weather for default cities (New York, London, Tokyo)
- [ ] Search bar works and shows autocomplete results
- [ ] Can click a city to see detailed view
- [ ] Charts display correctly (temperature, precipitation, wind)
- [ ] Can toggle between °C and °F
- [ ] Can add/remove favorites (heart icon)
- [ ] Favorites persist after page refresh
- [ ] Sign-in button works (if Supabase configured)
- [ ] Can download CSV data from city detail page

## Optional Enhancements

- [ ] Set up error monitoring (Sentry)
- [ ] Configure CI/CD pipeline
- [ ] Set up staging environment
- [ ] Add custom domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure CDN for frontend
- [ ] Add monitoring dashboard
- [ ] Set up alerts for API errors
- [ ] Implement rate limiting on production

## Known Issues to Watch For

### During Development

1. **"Unknown at rule @tailwind" warnings**: This is normal - Tailwind directives are processed during build
2. **API key activation delay**: OpenWeatherMap keys may take 10-15 minutes to activate
3. **CORS errors**: Make sure both backend and frontend are running

### Common Fixes

**Weather data not loading:**
- Check API key is correct in both frontend and backend `.env` files
- Verify OpenWeatherMap API key is activated
- Check browser console for error messages

**Favorites not saving:**
- If signed in: Check Supabase credentials
- If not signed in: Check browser localStorage permissions

**Charts not rendering:**
- Verify Recharts is installed: `cd frontend && npm list recharts`
- Check browser console for errors

## Production Deployment Checklist

- [ ] Change `NODE_ENV` to `production` in backend
- [ ] Update `REACT_APP_NODE_API_BASE` to production backend URL
- [ ] Enable HTTPS for both frontend and backend
- [ ] Update CORS settings to allow only production domain
- [ ] Set up environment variables in hosting platform
- [ ] Configure domain and SSL certificates
- [ ] Set up database connection pooling
- [ ] Enable response compression
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and alerts
- [ ] Configure automated backups
- [ ] Test all features in production environment
- [ ] Set up rate limiting rules
- [ ] Review security headers
- [ ] Enable DDoS protection

## Support & Resources

- **Documentation**: See `README.md`, `ARCHITECTURE.md`, `QUICKSTART.md`
- **OpenWeatherMap Docs**: https://openweathermap.org/api/one-call-3
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Redux Toolkit Docs**: https://redux-toolkit.js.org
- **Tailwind Docs**: https://tailwindcss.com/docs

## Questions?

If you encounter issues:
1. Check the console logs (frontend and backend)
2. Review the `README.md` troubleshooting section
3. Verify all environment variables are set correctly
4. Make sure API keys are activated and valid

---

✨ **Tip**: Start with `QUICKSTART.md` for the fastest path to a working app!
