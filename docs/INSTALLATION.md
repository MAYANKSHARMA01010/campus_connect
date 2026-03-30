# Installation Guide

Complete step-by-step guide to set up Campus Connect locally for development.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16+): [Download](https://nodejs.org/)
- **PostgreSQL** (v13+): [Download](https://www.postgresql.org/download/)
- **Git**: [Download](https://git-scm.com/)
- **Expo CLI** (optional): `npm install -g expo-cli`

### Verify Installation

```bash
node --version      # Should be v16+
npm --version       # Should be v8+
psql --version      # Should be v13+
git --version       # Should be v2.33+
```

---

## Backend Setup

### Step 1: Clone & Navigate

```bash
git clone https://github.com/MAYANKSHARMA01010/campus_connect.git
cd campus_connect/backend
```

### Step 2: Install Dependencies

```bash
pnpm install
# OR
npm install
```

**Pro Tip**: Use `pnpm` for faster installation and better disk space management.

### Step 3: Create Environment File

Create `.env` in `backend/`:

```env
# ====== SERVER CONFIGURATION ======
SERVER_PORT=5001
NODE_ENV=development
BACKEND_LOCAL_URL=http://localhost:5001
BACKEND_SERVER_URL=https://your-deployed-backend-url.com

# ====== DATABASE ======
DATABASE_URL="postgresql://postgres:password@localhost:5432/campus_connect"

# ====== AUTHENTICATION ======
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# ====== REDIS CACHING (Optional) ======
# Leave empty to use in-memory cache
REDIS_URL=redis://localhost:6379

# ====== CACHE CONFIGURATION ======
CACHE_TTL_HOME=60000
CACHE_TTL_EVENTS=45000
CACHE_TTL_SEARCH=30000
CACHE_TTL_DETAIL=120000

CACHE_STALE_HOME=120000
CACHE_STALE_EVENTS=90000
CACHE_STALE_SEARCH=60000
CACHE_STALE_DETAIL=240000

# ====== DATABASE PERFORMANCE ======
SLOW_QUERY_THRESHOLD_MS=250
HOME_CACHE_INTERVAL_MS=60000
DB_TIMEOUT_MS=7000
DB_CIRCUIT_BREAKER_THRESHOLD=5
DB_CIRCUIT_BREAKER_RESET_MS=30000

# ====== ALERTS (Optional) ======
ALERT_WEBHOOK_URL=https://your-webhook.example.com/alerts
```

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed explanations.

### Step 4: Generate Prisma Client

```bash
pnpm build
# OR
npx prisma generate
```

### Step 5: Create Database

```bash
# Create PostgreSQL database
createdb campus_connect

# Push schema to database (creates tables)
npx prisma db push

# OR run migrations
npx prisma migrate dev
```

### Step 6: Verify Setup

```bash
# Open Prisma Studio (visual database explorer)
npx prisma studio

# In another terminal, start the server
pnpm run dev
```

**Expected Output:**
```
🚀 Server running on port 5001
✅ Local Backend URL: http://localhost:5001
🗄️ Prisma datasource mode: DIRECT_URL
[home-cache] refresh interval 60000ms
```

**Test the API:**
```bash
curl http://localhost:5001/health
# Response: {"status":"ok"}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
pnpm install
# OR
npm install
```

### Step 3: Create Environment File

Create `.env` in `frontend/`:

```env
# ====== API ENDPOINTS ======
API_URL_DEV=http://10.7.29.205:5001
API_URL_LOCAL=http://localhost:5001
API_URL_PROD=https://campus-connect-asps.onrender.com

# ====== IMAGE UPLOAD (CLOUDINARY) ======
CLOUD_NAME=dzkuuvefk
UPLOAD_PRESET=event_upload_preset_23
```

**To Find Your Local IP (for physical device testing):**

macOS/Linux:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100
```

Windows:
```bash
ipconfig
# Look for IPv4 Address
```

Update `.env`:
```env
API_URL_DEV=http://192.168.1.100:5001
```

### Step 4: Start Development Server

```bash
pnpm start
# OR
npm start
```

**Expected Output:**
```
Starting Expo DevTools...
Expo DevTools is running at http://localhost:19002
```

---

## Testing Options

### Option 1: Android Emulator

```bash
Press: a
```

Requirements:
- Android Studio installed
- Android emulator running

### Option 2: iOS Simulator (macOS only)

```bash
Press: i
```

Requirements:
- Xcode installed

### Option 3: Physical Device (Best for Testing)

1. Download **Expo Go** app from App Store or Google Play
2. Update `API_URL_DEV` in `.env` to your local IP
3. In Expo terminal, press `w` to open web or scan QR code
4. Scan QR code with Expo Go app

**Verify Connection:**
- Open the app
- Navigate to Home screen
- Should see list of events

### Option 4: Web Browser (Limited Features)

```bash
Press: w
```

Good for:
- Quick UI testing
- Debugging
- Testing non-native features

---

## Verify Full Stack Setup

Open 3 terminals:

**Terminal 1: Backend API**
```bash
cd backend
pnpm run dev
# Wait until: 🚀 Server running on port 5001
```

**Terminal 2: Frontend App**
```bash
cd frontend
pnpm start
# Choose device (a, i, w, or scan QR)
```

**Terminal 3: Database Management (Optional)**
```bash
cd backend
npx prisma studio
# Opens http://localhost:5555
```

---

## Troubleshooting Installation

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions to common issues.

### Quick Fixes

**Port Already in Use:**
```bash
# Find process using port 5001
lsof -i :5001
# Kill process
kill -9 <PID>
```

**Database Connection Failed:**
```bash
# Verify PostgreSQL is running
psql -U postgres

# Create database if missing
createdb campus_connect
```

**Expo App Won't Connect:**
1. Ensure both devices on same WiFi
2. Check API_URL_DEV is correct
3. Restart Expo: Press Ctrl+C, then `pnpm start`

---

## Next Steps

- 📖 Read [API.md](./API.md) to understand available endpoints
- 🗄️ Check [DATABASE.md](./DATABASE.md) for schema details
- 🚀 Learn about [PRODUCTION_FEATURES.md](./PRODUCTION_FEATURES.md)
- 🌍 Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

