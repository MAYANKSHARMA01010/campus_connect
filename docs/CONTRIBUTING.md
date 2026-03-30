# Troubleshooting Guide

Solutions to common issues in Campus Connect.

## Backend Issues

### 1. Server Won't Start

**Error:**
```
Error: Cannot find module '@prisma/client'
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
pnpm install
# OR
npm install

# Then try starting again
pnpm run dev
```

---

### 2. Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
PrismaClient error: Database connection error
```

**Causes & Solutions:**

1. **PostgreSQL not running:**
   ```bash
   # macOS with Homebrew
   brew services start postgresql
   
   # Windows: Start PostgreSQL service from Services app
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Wrong DATABASE_URL:**
   ```bash
   # Check .env
   cat backend/.env | grep DATABASE_URL
   
   # Verify connection string format
   postgresql://username:password@localhost:5432/database_name
   ```

3. **Database doesn't exist:**
   ```bash
   # Create database
   createdb campus_connect
   
   # Or via Prisma
   npx prisma db push
   ```

4. **Database schema missing:**
   ```bash
   npx prisma migrate dev
   # OR
   npx prisma db push
   ```

---

### 3. Redis Connection Errors

**Error:**
```
[cache] redis unavailable, using in-memory fallback
ECONNREFUSED 127.0.0.1:6379
```

**This is OK!** The app gracefully falls back to in-memory cache.

**To fix (optional):**

1. **Install Redis:**
   ```bash
   # macOS
   brew install redis
   brew services start redis
   
   # Windows: Download Redis from GitHub
   # Linux
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   ```

2. **Or remove REDIS_URL from .env:**
   ```bash
   # Leave empty or comment out
   # REDIS_URL=
   ```

**Why not required:**
- App works without Redis (slower but functional)
- In-memory cache is sufficient for single-server
- Production adds Redis for scaling

---

### 4. Slow Queries Logged Excessively

**Error:**
```
[SLOW_QUERY] duration: 500ms threshold: 250ms
[SLOW_QUERY] duration: 600ms threshold: 250ms
```

**Solution:**

Either increase threshold or add indexes:

```env
# Option 1: Increase threshold
SLOW_QUERY_THRESHOLD_MS=500  # Log only very slow queries
```

OR

```bash
# Option 2: Add missing indexes
npx prisma migrate dev

# Check if all migrations applied
npx prisma migrate status
```

---

### 5. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE :::5001
Port 5001 is already in use
```

**Solution:**

```bash
# Find process using port 5001
lsof -i :5001
# Output: node    12345  user    5u  IPv6  0x...

# Kill process
kill -9 12345

# OR change port in .env
SERVER_PORT=5002
```

---

### 6. JWT Token Expired/Invalid

**Error:**
```
401 Unauthorized
Invalid token
```

**Solution:**

1. **Token expired (normal):**
   - User must re-login
   - Frontend will handle this

2. **JWT_SECRET changed:**
   - All existing tokens invalid
   - Users need to re-login
   - Note: Don't change JWT_SECRET in production

3. **Malformed token:**
   - Check Authorization header format
   - Must be: `Authorization: Bearer <token>`

---

### 7. Prisma Build Fails

**Error:**
```
Error: Could not compile TypeScript
Error: Missing @prisma/client
```

**Solution:**
```bash
# Clear prisma cache
rm -rf node_modules/.prisma

# Regenerate
pnpm build
# OR
npx prisma generate
```

---

## Frontend Issues

### 1. Blank White Screen

**Error:**
```
App opens but shows white screen
Module not found error
```

**Solution:**

```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
rm -rf /tmp/expo-cache

pnpm install
npx expo start --clear
```

---

### 2. API Connection Failed

**Error:**
```
Network error
Cannot fetch from API
Failed to fetch
```

**Solutions:**

1. **Check backend running:**
   ```bash
   # Terminal 1
   curl http://localhost:5001/health
   # Should return: {"status":"ok"}
   ```

2. **Wrong API URL:**
   ```bash
   # Check frontend/.env
   cat frontend/.env | grep API_URL
   
   # If using emulator, use localhost
   # If using physical device, use local network IP
   ```

3. **Physical device connection:**
   ```bash
   # Find your local IP
   ifconfig | grep "inet "
   
   # Update .env
   API_URL_DEV=http://192.168.1.100:5001
   
   # Ensure both on same WiFi
   ```

4. **CORS issue (unlikely):**
   - Backend should have CORS enabled
   - Check `backend/config/cors.js`

---

### 3. Image Upload Fails

**Error:**
```
Image upload failed
Cannot upload to Cloudinary
```

**Solution:**

1. **Verify Cloudinary credentials:**
   ```bash
   cat frontend/.env | grep CLOUD_NAME
   cat frontend/.env | grep UPLOAD_PRESET
   ```

2. **Test Cloudinary:**
   - Go to cloudinary.com dashboard
   - Check Upload settings
   - Verify preset exists

3. **Regenerate preset:**
   - Settings → Upload → Create new preset
   - Mode: Unsigned
   - Update .env

4. **Check network:**
   - If using VPN, disable temporarily
   - Check firewall rules

---

### 4. Expo Won't Connect

**Error:**
```
QR code not scanning
Cannot connect to metro bundler
```

**Solution:**

```bash
# Restart Expo development server
cd frontend

# Press Ctrl+C to stop
# Clear cache and start fresh
npx expo start --clear

# Scan new QR code
```

**If still failing:**
```bash
# Reset Expo cache globally
rm -rf $EXPO_HOME/cache

# Remove old cache
rm -rf node_modules/expo-constants

pnpm install
npx expo start --clear
```

---

### 5. App Crashes on Startup

**Error:**
```
App starts but crashes immediately
Fatal error: Cannot read property 'xxx' of undefined
```

**Solution:**

1. **Check context provider:**
   - Ensure UserContext wrapper in App.js
   - Check context initialization

2. **Check API calls:**
   - Ensure token saved after login
   - Verify API_URL configured

3. **Check permissions:**
   - App needs permissions for camera, storage
   - Grant permissions in device settings

4. **Check async operations:**
   - AsyncStorage operations might fail
   - Check try-catch blocks

---

### 6. Missing Expo Go Dependencies

**Error:**
```
Cannot find module 'expo-image-picker'
Cannot find module '@react-native-async-storage/async-storage'
```

**Solution:**

```bash
cd frontend

# Install all dependencies
pnpm install

# OR specific library
pnpm add expo-image-picker
pnpm add @react-native-async-storage/async-storage

# Then restart
npx expo start --clear
```

---

## Database Issues

### 1. Migration Errors

**Error:**
```
Migration failed
Cannot migrate: column already exists
```

**Solution:**

```bash
# Check migration status
npx prisma migrate status

# Resolve conflicts manually if needed
npx prisma migrate resolve --rolled-back <migration-name>

# Retry
npx prisma migrate deploy
```

---

### 2. Schema Drift

**Error:**
```
Your database schema is not in sync with your Prisma schema
```

**Solution:**

**⚠️ WARNING: This resets the database!**

```bash
# Development only
npx prisma migrate reset

# Applies migrations from scratch
# Clears all data
```

**Alternative (safer):**
```bash
# Push schema without migration
npx prisma db push
```

---

### 3. Foreign Key Constraint Error

**Error:**
```
violates foreign key constraint
Cannot delete: referenced in other tables
```

**Solution:**

This was fixed with cascade deletes. If still occurring:

```bash
# Check migrations applied
npx prisma migrate status

# Apply cascade delete migration
npx prisma migrate deploy
```

---

## Performance Issues

### 1. App Feels Slow

**Causes:**
- No caching enabled
- Database too slow
- Network latency

**Solutions:**

```bash
# Check cache status
grep "\[cache\]" logs  # Should see "redis connected"

# Monitor slow queries
grep "SLOW_QUERY" logs | head -20

# Check network latency
curl -w "@curl-format.txt" http://localhost:5001/api/events
```

---

### 2. Database Under Load

**Symptoms:**
- Database taking 10+ seconds
- Timeouts

**Solution:**

```bash
# Monitor database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Kill slow queries
SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
WHERE state = 'active' AND query_start < NOW() - INTERVAL '10 minutes';

# Add missing indexes
npx prisma migrate deploy
```

---

## Network Issues

### 1. Can't Reach Backend from Physical Device

**Check:**
1. Both devices on same WiFi
2. Correct IP in API_URL_DEV
3. Backend port open (5001)
4. Firewall allows connection

**Test:**
```bash
# From mobile device
ping 192.168.1.100  # Your machine IP

# Access backend
curl http://192.168.1.100:5001/health
```

---

### 2. CORS Error (Unlikely)

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution (Backend):**
```bash
# Check cors.js configuration
cat backend/config/cors.js

# Should allow your frontend origin
```

---

## Getting Help

If you can't find solution:

1. **Check logs:**
   ```bash
   # Backend logs
   tail -f backend/logs.txt
   
   # Frontend DevTools
   Press 'd' in Expo terminal
   ```

2. **Search GitHub Issues:**
   - [Campus Connect Issues](https://github.com/MAYANKSHARMA01010/campus_connect/issues)

3. **Contact Author:**
   - Email: sharmamayank01010@gmail.com
   - GitHub: @MAYANKSHARMA01010

4. **Read Documentation:**
   - [INSTALLATION.md](./INSTALLATION.md)
   - [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

