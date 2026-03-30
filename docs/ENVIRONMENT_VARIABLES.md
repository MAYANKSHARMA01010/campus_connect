# Environment Variables Guide

Complete reference for all environment variables used in Campus Connect.

## Backend Environment Variables

### Server Configuration

**`SERVER_PORT`**
- Default: `5001`
- Type: Number
- Purpose: Port where the API server listens
- Example: `SERVER_PORT=5001`
- Note: Change only if port 5001 is in use

**`NODE_ENV`**
- Type: `development` | `production`
- Default: `development`
- Purpose: Controls application behavior (logging, error handling)
- Development: Detailed logs, auto-reload
- Production: Optimized, minimal logs

**`BACKEND_LOCAL_URL`**
- Default: `http://localhost:5001`
- Purpose: For local development reference
- Used in: Logging, email notifications

**`BACKEND_SERVER_URL`**
- Type: URL
- Purpose: Deployed backend URL for production
- Example: `https://campus-connect-asps.onrender.com`
- Used in: Email links, frontend API calls in production

### Database Configuration

**`DATABASE_URL`**
- Type: PostgreSQL connection string
- Format: `postgresql://[user]:[password]@[host]:[port]/[database]`
- Example: `postgresql://postgres:password@localhost:5432/campus_connect`
- **Required**: Yes
- Where to get:
  1. Install PostgreSQL locally, OR
  2. Get from cloud provider (Heroku, Railway, Supabase)

**Components:**
- `postgres` - Default PostgreSQL superuser
- `password` - Your database password
- `localhost` - Database host (localhost = local machine)
- `5432` - Default PostgreSQL port
- `campus_connect` - Database name

### Authentication

**`JWT_SECRET`**
- Type: String (min 32 characters)
- Purpose: Secret key for signing JWT tokens
- **Security**: Change in production!
- Generate new secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Used for: Token signing, token validation
- **Never share**: Treat like password

### Caching Configuration

#### Redis

**`REDIS_URL`**
- Type: URL
- Format: `redis://[host]:[port]`
- With auth: `redis://:[password]@[host]:[port]`
- Optional: Leave empty for in-memory cache only
- Default behavior: Graceful fallback to in-memory
- Examples:
  - Local: `redis://localhost:6379`
  - Production: `redis://default:password@redis.example.com:6379`
- Benefits when set:
  - 10-100x faster cache reads
  - Distributed caching (multiple servers)
  - Persistent cache across restarts

**If Redis Not Available:**
- In-memory Map used as fallback
- Application continues working
- Performance degrades slightly (still very fast)
- Warning logged: `[cache] redis unavailable, using in-memory fallback`

### Cache TTL (Time To Live)

How long data stays "fresh" (never served stale).

**`CACHE_TTL_HOME`** (Home Screen Events)
- Default: `60000` (60 seconds)
- Used: GET /events/home
- Balance: Fresh data vs database load
- Recommendation: 60-120s

**`CACHE_TTL_EVENTS`** (Event List)
- Default: `45000` (45 seconds)
- Used: GET /events
- Recommendation: 30-60s

**`CACHE_TTL_SEARCH`** (Search Results)
- Default: `30000` (30 seconds)
- Used: GET /events/search
- Shorter TTL: Results change frequently
- Recommendation: 20-45s

**`CACHE_TTL_DETAIL`** (Individual Event)
- Default: `120000` (120 seconds)
- Used: GET /events/:id
- Longer TTL: Detailed data changes less frequently
- Recommendation: 60-180s

### Cache Stale Window

How long "stale" data served while refreshing in background.

**`CACHE_STALE_HOME`**
- Default: `120000` (120 seconds total)
- Fresh: 0-60s (serve cache immediately)
- Stale: 60-120s (serve cache + refresh background)
- Benefit: Instant UX while keeping data fresh

**`CACHE_STALE_EVENTS`**
- Default: `90000` (90 seconds total)
- Formula: Fresh + Stale = Total
- 45s fresh + 45s stale = 90s total

**`CACHE_STALE_SEARCH`**
- Default: `60000` (60 seconds total)
- Shorter window: Search results volatile

**`CACHE_STALE_DETAIL`**
- Default: `240000` (240 seconds total)
- Longer window: Detail data stable

**How SWR (Stale-While-Revalidate) Works:**

```
Time:    0s          45s          90s
        │            │            │
Status: FRESH      STALE        EXPIRED
        ├────────────┼────────────┤
        │ Serve      │ Serve      │ Fresh
        │ cache      │ cache +    │ request
        │ instantly  │ refresh    │
        │            │ background │
Response<50ms       <50ms        50-500ms
```

### Performance Monitoring

**`SLOW_QUERY_THRESHOLD_MS`**
- Default: `250` (milliseconds)
- Purpose: Log queries slower than threshold
- Used for: Performance optimization
- Queries > 250ms logged with full details
- Example log: `[SLOW_QUERY] duration: 357ms threshold: 250ms query: "SELECT..."`
- Tuning:
  - Lower (100ms): Catch more slow queries
  - Higher (500ms): Only critical queries

### Home Cache Scheduler

**`HOME_CACHE_INTERVAL_MS`**
- Default: `60000` (60 seconds)
- Purpose: How often to precompute home screen data
- Benefits:
  - Home screen always fast (<50ms)
  - Reduces database load
  - Warm cache at startup
- Trade-off: Uses background processing
- Recommendation: 30-120 seconds

### Database Guards

**`DB_TIMEOUT_MS`**
- Default: `7000` (7 seconds)
- Purpose: Max time per query
- Prevents: Hanging queries blocking connections
- If exceeded: Query killed, error returned
- Too low (1s): Legitimate queries timeout
- Too high (30s): Hanging queries block pool

**`DB_CIRCUIT_BREAKER_THRESHOLD`**
- Default: `5`
- Purpose: Open circuit after N consecutive failures
- Example:
  - 1st failure: Try again
  - 2nd failure: Try again
  - 3rd failure: Try again
  - 4th failure: Try again
  - 5th failure: **CIRCUIT OPEN** (return error immediately)
- Benefit: Prevents cascading failures

**`DB_CIRCUIT_BREAKER_RESET_MS`**
- Default: `30000` (30 seconds)
- Purpose: Time before testing if database recovered
- Behavior:
  - Circuit open → return error for 30s
  - After 30s → try 1 request (half-open)
  - Success → circuit closes
  - Failure → circuit opens again

### Alerting

**`ALERT_WEBHOOK_URL`**
- Optional: Can be empty
- Type: URL
- Purpose: Webhook for critical alerts
- Used for:
  - Server startup alerts
  - Database connection failures
  - Circuit breaker activation
  - Health check failures
- Examples:
  - Discord: `https://discord.com/api/webhooks/...`
  - Slack: `https://hooks.slack.com/services/...`
  - Custom: Your own endpoint

**Webhook Payload:**
```json
{
  "timestamp": "2026-03-30T10:30:00Z",
  "type": "DATABASE_ERROR",
  "message": "Database connection failed",
  "severity": "CRITICAL"
}
```

---

## Frontend Environment Variables

### API Endpoints

**`API_URL_DEV`** (Local Network Development)
- Type: URL
- Example: `http://192.168.1.100:5001`
- Used: Physical device testing
- Find your IP: `ifconfig | grep "inet "`
- Requirement: Device on same WiFi network

**`API_URL_LOCAL`** (Simulator/Emulator)
- Type: URL
- Default: `http://localhost:5001`
- Used: iOS Simulator, Android Emulator
- Why: `localhost` works inside emulator/simulator

**`API_URL_PROD`** (Production)
- Type: URL
- Default: `https://campus-connect-asps.onrender.com`
- Used: Production builds in App Store/Play Store
- Should be: Your deployed backend URL

**How Selection Works:**

```javascript
const API_URL = 
  __DEV__ && USE_LOCAL_API 
    ? API_URL_LOCAL      // Emulator: localhost
    : __DEV__ 
      ? API_URL_DEV      // Physical device: local IP
      : API_URL_PROD     // Production: deployed domain
```

### Image Upload (Cloudinary)

**`CLOUD_NAME`**
- Default: `dzkuuvefk`
- Purpose: Cloudinary project identifier
- Get from: [Cloudinary Dashboard](https://cloudinary.com/console/settings/api-keys)
- Steps:
  1. Sign up at cloudinary.com
  2. Go to Settings → API Keys
  3. Copy Cloud Name
  4. Paste in .env

**`UPLOAD_PRESET`**
- Default: `event_upload_preset_23`
- Purpose: Upload permissions and settings
- Type: Unsigned upload preset
- Get from: [Cloudinary Dashboard](https://cloudinary.com/console/settings/upload)
- Steps:
  1. Go to Settings → Upload
  2. Scroll to "Upload presets"
  3. Create new preset with Mode: `Unsigned`
  4. Copy preset name
  5. Paste in .env

**Why Cloudinary:**
- Free tier: 25GB storage
- Automatic image optimization
- Global CDN (fast delivery worldwide)
- No backend storage needed
- Reduces database size

---

## Environment Selection by Scenario

### Local Development (Emulator/Simulator)

```env
# backend/.env
SERVER_PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/campus_connect
JWT_SECRET=dev_secret_key_change_in_production
REDIS_URL=  # Empty (use in-memory)

# frontend/.env
API_URL_LOCAL=http://localhost:5001
API_URL_DEV=http://10.7.29.205:5001
API_URL_PROD=https://campus-connect-asps.onrender.com
```

### Physical Device Testing (Same WiFi)

```env
# backend/.env
# Same as local development

# frontend/.env
API_URL_DEV=http://192.168.1.100:5001  # Your machine IP
# Other URLs same
```

### Production Deployment

```env
# backend/.env
SERVER_PORT=5001
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db.com:5432/campus_connect
JWT_SECRET=generate_new_secret_for_production
REDIS_URL=redis://default:pass@redis.com:6379
ALERT_WEBHOOK_URL=https://your-webhook.com/alerts

# frontend/.env
API_URL_LOCAL=http://localhost:5001  # Not used
API_URL_DEV=http://ignored:5001      # Not used
API_URL_PROD=https://your-api.com    # Used in production
```

---

## Environment Variable Best Practices

✅ **DO:**
- Use strong JWT_SECRET (32+ characters)
- Different secrets for dev/prod
- Rotate secrets periodically
- Use 0.0.0.0 for server binding (not localhost)

❌ **DON'T:**
- Commit .env files to git (use .gitignore)
- Hardcode secrets in code
- Share production secrets
- Use default values for sensitive vars

---

## Checking Current Configuration

```bash
# Backend: Display all env vars (sanitized)
cd backend
cat .env | grep -v SECRET | grep -v PASSWORD | grep -v URL

# Frontend: Display all env vars
cd frontend
cat .env
```

---

## Troubleshooting Environment Variables

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for solutions to common env var issues.

