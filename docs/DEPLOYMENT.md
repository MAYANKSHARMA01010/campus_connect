# Deployment Guide

Complete guide to deploying Campus Connect to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificates ready
- [ ] Monitoring configured
- [ ] Alert webhooks working
- [ ] Team notified

---

## Backend Deployment

### Option 1: Render.com (Recommended)

**Render** provides easy Node.js hosting with automatic deployments from GitHub.

#### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up (GitHub recommended)
3. Connect GitHub account

#### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Select Campus Connect repository
3. Configure:
   - **Service Name**: `campus-connect-backend`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Instance Type**: Starter (free) or Standard

#### Step 3: Add Environment Variables

1. Scroll to "Environment"
2. Add all variables from [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md):

```env
DATABASE_URL=postgresql://user:pass@db.render.com:5432/db
JWT_SECRET=generate_new_secret_for_production
REDIS_URL=redis://default:pass@redis.com:6379
NODE_ENV=production
SLOW_QUERY_THRESHOLD_MS=250
DB_TIMEOUT_MS=7000
# ... other variables
```

#### Step 4: Add PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Database Name**: `campus_connect`
   - **User**: `postgres`
   - **Password**: Generate secure password
   - **Region**: Same as backend
   - **Version**: 14+

3. Copy connection string → Add as `DATABASE_URL`

#### Step 5: Add Redis Cache (Optional but Recommended)

1. Click "New +" → "Redis"
2. Configure:
   - **Name**: `campus-connect-cache`
   - **Region**: Same as backend
   - **Plan**: Starter

3. Copy connection string → Add as `REDIS_URL`

#### Step 6: Deploy

1. Click "Deploy" button
2. Watch deployment logs
3. Wait until "Service is live"

**Expected Deployment Time:** 2-5 minutes

#### Step 7: Run Database Migrations

1. In Render dashboard, find your service
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

#### Step 8: Verify Deployment

```bash
curl https://your-service.onrender.com/health
# Should return: {"status":"ok"}

curl https://your-service.onrender.com/health/db
# Should return: {"status":"ok","latency":XX}
```

**Expected URL:** `https://campus-connect-xxxxx.onrender.com`

---

### Option 2: Heroku (Legacy)

**Note:** Heroku discontinued free tier. Use Render instead.

---

### Option 3: Docker + Your Own Server

**For Advanced Users**

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 5001

# Start server
CMD ["pnpm", "start"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5001:5001"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/campus_connect
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your_secret
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: campus_connect
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always

volumes:
  postgres_data:
  redis_data:
```

#### Step 3: Deploy to Server

```bash
# On your server
docker-compose up -d

# Verify
docker-compose logs backend
```

---

## Frontend Deployment

### Option 1: Expo EAS Build

**EAS (Expo Application Services)** automates app building.

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

#### Step 2: Configure eas.json

Located at `frontend/eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview3": {
      "configName": "preview"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

#### Step 3: Update API URL for Production

```env
# frontend/.env
API_URL_PROD=https://your-api.onrender.com
```

#### Step 4: Build APK (Android)

```bash
cd frontend
eas build --platform android --profile production
```

**Configuration:**
- Keystore: Create new (free)
- Build time: 10-15 minutes
- Output: APK file for Play Store

#### Step 5: Build IPA (iOS)

```bash
eas build --platform ios --profile production
```

**Requirements:**
- Apple Developer Account ($99/year)
- Signing certificate
- Build time: 20-30 minutes

#### Step 6: Submit to Stores

**Google Play Store:**
```bash
eas submit --platform android --latest
```

Steps:
1. Create Play Store account
2. Create app listing
3. eas submit uploads APK
4. Review & publish (1-3 hours)

**Apple App Store:**
```bash
eas submit --platform ios --latest
```

Steps:
1. Create Apple Developer account
2. Create app in App Store Connect
3. eas submit uploads IPA
4. Review & publish (24-48 hours)

---

## Post-Deployment Tasks

### 1. Verify Functionality

```bash
# Test user registration
curl -X POST http://your-api/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Test event listing
curl http://your-api/api/events

# Test health check
curl http://your-api/health
```

### 2. Monitor Logs

**Render:**
```bash
# View logs
render-cli logs --service-id=srv_xxxxx

# Watch real-time
render-cli logs --service-id=srv_xxxxx --follow
```

**Check for:**
- Database connection errors
- Redis connection errors
- Startup errors

### 3. Set Up Monitoring

**Tools:**
- **Uptime**: UptimeRobot (free)
- **Logs**: Logtail, DataDog
- **Errors**: Sentry
- **Performance**: New Relic

**Key Metrics:**
```bash
# Check response time
time curl https://your-api/health

# Should be <500ms

# Check error rate
curl -i https://your-api/api/events
# Should return 200 status
```

### 4. Configure Alerts

**Webhook Example (Discord):**

```env
ALERT_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID
```

**Alert Types:**
- Database connection failures
- Memory usage > 80%
- Response time > 1s
- Error rate > 1%

### 5. Backup Strategy

**Weekly Backups:**
```bash
# Automated on Render (check dashboard)

# Manual backup
pg_dump DATABASE_URL > backup-2026-03-30.sql

# Store backup safely (AWS S3, Backblaze, etc.)
```

---

## Database Migrations in Production

**Before deploying new schema changes:**

1. Test locally:
   ```bash
   npx prisma migrate dev
   ```

2. Create migration:
   ```bash
   npx prisma migrate deploy --preview-feature
   ```

3. In production:
   ```bash
   # Via Render Shell (SSH into container)
   npx prisma migrate deploy
   ```

---

## Rolling Back Deployment

### If There's a Critical Issue:

**On Render:**
1. Go to "Deploys" tab
2. Find previous working deployment
3. Click "Redeploy"

**Automatic Rollback:**
```bash
# Redeploy previous git commit
git revert HEAD
git push
# Render auto-deploys new push
```

---

## Performance Tuning

### Monitor & Optimize:

```bash
# Check response times
curl -i -w "@curl-format.txt" https://your-api/events

# Analyze slow queries (first 24 hours)
grep SLOW_QUERY logs | head -20

# Add indexes if needed
npx prisma db execute < add-indexes.sql
```

### Database Optimization:

```bash
# Check table sizes
SELECT 
  schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM "EventRequest" WHERE status = 'APPROVED';
```

---

## Team Collaboration

### Deployment Checklist:

Before deploying:
1. **Code Review**: All PRs reviewed ✓
2. **Tests**: All tests passing ✓
3. **Migration**: Database migrations tested ✓
4. **Secrets**: All env vars updated ✓
5. **Backup**: Database backed up ✓
6. **Notify**: Team informed ✓

### Communication Channels:

- **Before**: Slack post in #deployments
- **During**: Live updates
- **After**: Summary of changes

---

## Cost Estimation (Render)

### Free Tier:

- Backend: Free (limited uptime)
- Database: $7/month (PostgreSQL starter)
- Redis: $7/month (Redis starter)
- **Total**: ~$14/month

### Standard Tier:

- Backend: $12/month (0.5GB RAM)
- Database: $15/month (1GB)
- Redis: $15/month (1GB)
- **Total**: ~$42/month

---

## Troubleshooting Deployment

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues.

---

## Next Steps

1. Deploy backend ✓
2. Test endpoints thoroughly
3. Deploy frontend to app stores
4. Monitor for 24 hours
5. Gather user feedback
6. Deploy frontend updates as needed

