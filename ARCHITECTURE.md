# Architecture Documentation 🏗️

## System Overview

The Weather Analytics Dashboard follows a client-server architecture with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Redux     │  │  React     │  │  Supabase Client     │  │
│  │  Store     │◄─┤  Components│◄─┤  (Auth)              │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│        │                │                                    │
└────────┼────────────────┼────────────────────────────────────┘
         │                │
         ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Cache     │  │  Weather   │  │  Supabase Service    │  │
│  │  Layer     │◄─┤  Service   │◄─┤  (Server-side)       │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│        │                │                │                   │
└────────┼────────────────┼────────────────┼───────────────────┘
         │                │                │
         ▼                ▼                ▼
    ┌──────────┐   ┌──────────────┐  ┌─────────────┐
    │ NodeCache│   │ OpenWeatherMap│  │  Supabase   │
    └──────────┘   └──────────────┘  └─────────────┘
```

## Frontend Architecture

### State Management (Redux Toolkit)

**Slices:**
1. **authSlice**: User authentication state
   - User profile
   - Session management
   - Google OAuth flow

2. **weatherSlice**: Weather data cache
   - Organized by city key
   - Tracks fetch status and timestamps
   - Normalizes API responses

3. **favoritesSlice**: User favorites
   - Syncs with Supabase for authenticated users
   - Falls back to localStorage for guests
   - Real-time updates

4. **settingsSlice**: User preferences
   - Temperature unit (Celsius/Fahrenheit)
   - Refresh interval
   - Theme preferences

### Component Hierarchy

```
App
├── Header
│   ├── UnitToggle
│   └── AuthButton
├── Routes
│   ├── Dashboard
│   │   ├── SearchBar
│   │   └── CityCard[]
│   │       └── FavoriteButton
│   └── CityDetail
│       ├── FavoriteButton
│       └── Charts
│           ├── TempChart
│           ├── PrecipChart
│           └── WindChart
└── Footer
```

### Data Flow

1. **Initial Load:**
   - Check authentication state
   - Load favorites from Supabase/localStorage
   - Fetch weather for favorite cities

2. **Real-time Updates (Polling):**
   - `usePolling` hook triggers every 60s
   - Dispatch `fetchCurrentWeather` for each city
   - Backend cache minimizes API calls
   - Pauses when tab is hidden

3. **User Actions:**
   - Search → API call → Navigate to CityDetail
   - Toggle favorite → Update Redux → Sync to Supabase/localStorage
   - Toggle unit → Update Redux → Re-render all temperatures

## Backend Architecture

### Caching Strategy

**Cache Manager (cache.js)**
```javascript
class CacheManager {
  cache: NodeCache       // TTL-based in-memory cache
  inFlightRequests: Map  // Request coalescing
  
  getOrFetch(key, fetchFn, ttl) {
    // 1. Check cache
    // 2. Check if request in-flight
    // 3. Make new request if needed
    // 4. Store in cache with TTL
  }
}
```

**Benefits:**
- Reduces external API calls by ~95%
- Prevents duplicate concurrent requests
- 60-second TTL balances freshness and performance

### Request Coalescing

When multiple clients request the same city simultaneously:
```
Client A ──┐
Client B ──┼──► Backend ──► Single API Call ──► Shared Response
Client C ──┘
```

### Rate Limiting

Three tiers of protection:
1. **General API**: 100 req/15min per IP
2. **Weather endpoints**: 30 req/min per IP
3. **Auth endpoints**: 5 req/15min per IP

### Historical Snapshots

- **Sampling**: 10% of weather requests
- **Purpose**: Trend analysis, historical queries
- **Storage**: Supabase (JSONB format)
- **Retention**: Configurable (recommend 30 days)

## Database Schema (Supabase)

### Tables

**favorites**
```sql
id: UUID (PK)
user_id: UUID (FK → auth.users)
city_name: TEXT
lat: NUMERIC
lon: NUMERIC
created_at: TIMESTAMPTZ
UNIQUE(user_id, city_name)
```

**historical_snapshots**
```sql
id: UUID (PK)
city_name: TEXT
lat: NUMERIC
lon: NUMERIC
snapshot_time: TIMESTAMPTZ
payload: JSONB
created_at: TIMESTAMPTZ
```

### Row Level Security (RLS)

**favorites:**
- Users can only view/insert/delete their own favorites
- Enforced via `auth.uid() = user_id`

**historical_snapshots:**
- All authenticated users can read
- Only service role can insert (backend)

## API Design

### RESTful Endpoints

**Weather Service:**
- `GET /api/weather/current?city=<city>`
- `GET /api/weather/forecast?city=<city>&days=7`
- `GET /api/weather/hourly?city=<city>&hours=24`
- `GET /api/weather/historical?city=<city>&from=<date>&to=<date>`
- `GET /api/weather/search?q=<query>&limit=5`

**Favorites Service:**
- `GET /api/favorites` (protected)
- `POST /api/favorites` (protected)
- `DELETE /api/favorites/:cityName` (protected)

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "cached": false,
  "cacheStats": { ... }
}
```

## Performance Optimizations

### Frontend

1. **Code Splitting**: Route-based chunks
2. **Lazy Loading**: Charts loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Debouncing**: Search input (500ms)
5. **Virtualization**: For large lists (if needed)

### Backend

1. **Caching**: 60s TTL with request coalescing
2. **Compression**: Gzip responses
3. **Connection Pooling**: Supabase client reuse
4. **Rate Limiting**: Prevent abuse

### Network

1. **CDN**: Static assets served via CDN
2. **HTTP/2**: Multiplexing support
3. **Compression**: Gzip/Brotli
4. **Caching Headers**: Browser caching for static files

## Scalability Considerations

### Current Limits (Development)

- **In-memory cache**: Limited to single server
- **Polling**: N clients × N cities × 1req/60s

### Production Recommendations

1. **Distributed Cache**: Redis Cluster
   - Shared cache across multiple backend instances
   - Pub/sub for cache invalidation

2. **WebSockets**: Replace polling with real-time push
   - Socket.io or native WebSockets
   - Room-based subscriptions per city

3. **Load Balancing**: Multiple backend instances
   - Nginx or cloud load balancer
   - Session affinity not required (stateless)

4. **Database Optimization**:
   - Partitioning for historical_snapshots
   - Indexes on frequently queried columns
   - Read replicas for analytics queries

5. **CDN**: CloudFlare, CloudFront, or Fastly
   - Cache static assets
   - DDoS protection
   - Edge caching for API responses

## Security Architecture

### Authentication Flow

```
1. User clicks "Sign In"
2. Frontend → Supabase Auth → Google OAuth
3. Google redirects back with code
4. Supabase exchanges code for JWT
5. Frontend stores JWT in Redux
6. JWT included in all protected API calls
7. Backend verifies JWT with Supabase
```

### Security Layers

1. **Input Validation**: Sanitize all user inputs
2. **Rate Limiting**: Prevent brute force
3. **CORS**: Whitelist allowed origins
4. **Helmet.js**: Security headers
5. **HTTPS**: Encrypt all traffic (production)
6. **Environment Variables**: Never commit secrets
7. **RLS**: Database-level access control

## Error Handling

### Frontend

- **Network errors**: Retry with exponential backoff
- **API errors**: User-friendly messages
- **Validation errors**: Inline form feedback
- **Auth errors**: Redirect to login

### Backend

- **External API failures**: Return cached data if available
- **Database errors**: Log and return generic error
- **Validation errors**: 400 with detailed message
- **Auth errors**: 401/403 with clear message

## Monitoring & Logging

### Metrics to Track

1. **Performance**:
   - API response times
   - Cache hit rate
   - Frontend page load time

2. **Usage**:
   - Daily active users
   - Popular cities
   - API call volume

3. **Errors**:
   - Error rates by endpoint
   - Failed authentication attempts
   - External API failures

### Recommended Tools

- **Frontend**: Sentry, LogRocket
- **Backend**: Winston, Pino, or Bunyan
- **Infrastructure**: Datadog, New Relic, or Prometheus

## Testing Strategy

### Frontend Tests

- **Unit**: Jest + React Testing Library
- **Integration**: Test Redux flow
- **E2E**: Cypress or Playwright

### Backend Tests

- **Unit**: Jest + Supertest
- **Integration**: Test API endpoints
- **Load**: Artillery or k6

## Future Enhancements

1. **Notifications**: Alert users of severe weather
2. **Comparison Mode**: Compare weather between cities
3. **Historical Analysis**: Trend charts for past 30 days
4. **Weather Maps**: Interactive map view
5. **Mobile App**: React Native version
6. **AI Predictions**: ML-based weather forecasting
7. **Social Features**: Share weather reports
8. **Widgets**: Embeddable weather widgets

---

This architecture is designed for:
- ✅ Scalability (horizontal scaling ready)
- ✅ Performance (aggressive caching)
- ✅ Security (defense in depth)
- ✅ Maintainability (clean separation of concerns)
- ✅ Developer Experience (clear structure, good DX)
