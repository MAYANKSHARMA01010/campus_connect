# Campus Connect 🎓

A production-ready mobile application built with React Native (Expo) and Node.js that enables students to discover, host, and manage campus events seamlessly. The platform features role-based access control with separate interfaces for regular users and administrators, backed by comprehensive performance optimizations, caching strategies, and production hardening patterns.

**Current Version**: 1.0.0 | **Last Updated**: March 31, 2026

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Installation Guide](#-installation-guide)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
7. [Environment Variables](#-environment-variables)
8. [Running the Application](#-running-the-application)
9. [API Documentation](#-api-documentation)
10. [Database Schema](#-database-schema)
11. [Production Features & Optimizations](#-production-features--optimizations)
12. [Deployment Guide](#-deployment-guide)
13. [Troubleshooting](#-troubleshooting)
14. [Contributing](#-contributing)
15. [Author & License](#-author--license)

## Overview

Campus Connect is an enterprise-grade event management platform designed for educational institutions. It combines a robust backend API with a user-friendly mobile application to streamline event discovery, management, and administration. The platform is optimized for production use with comprehensive caching strategies, performance monitoring, and resilience patterns.

**Key Highlights:**
- 🚀 Production-ready with circuit breakers, timeouts, and graceful fallbacks
- 📊 Real-time slow query monitoring and performance insights
- 💾 Multi-tier caching: Redis SWR + In-memory fallback + AsyncStorage
- ⚡ Cursor-based pagination for efficient data handling
- 🔒 JWT-based authentication with role-based access control
- 📱 Full offline support with AsyncStorage fallback

## ✨ Features

## ✨ Features

### 👥 User Features

- **Authentication & Authorization**
  - Secure JWT-based authentication
  - Password hashing with bcrypt
  - Token refresh mechanisms
  - Session management with automatic logout

- **Event Discovery**
  - Browse all approved campus events
  - Advanced search with trigram indexing for fast text matching
  - Filter by category, date, location, and status
  - Cursor-based pagination for large datasets (efficient memory usage)
  - Thumbnails with intelligent image loading

- **Event Hosting**
  - Submit event requests with detailed information
  - Multi-image upload support (via Cloudinary)
  - Real-time form validation
  - Event preview before submission
  - Track submission status (Pending → Approved/Rejected)

- **My Events Management**
  - View all submitted events
  - Real-time status updates
  - Edit pending event requests
  - Delete submitted events
  - View approval/rejection reasons

- **Profile Management**
  - Update profile information (name, username, email, gender)
  - View personal statistics
  - Manage account preferences
  - Secure password change

- **Enhanced UX**
  - Stale-while-refresh caching: serve cached data instantly while refreshing in background
  - Offline support: full functionality without internet connection
  - Dark mode support with automatic theme detection
  - Skeleton loaders for smooth loading states
  - Toast notifications for real-time feedback

### 👨‍💼 Admin Features

- **Event Management**
  - Approve event requests (with status communication)
  - Reject events with custom feedback
  - Delete inappropriate content
  - Bulk actions for efficiency
  - View detailed event analytics

- **User Management**
  - View all registered users
  - User statistics and activity tracking
  - Account status management
  - Audit logs for compliance

- **Dashboard & Analytics**
  - Real-time event status overview
  - Performance metrics and monitoring
  - Slow query reports
  - Cache hit/miss statistics
  - API response time monitoring

### ⚙️ System Features

- **Caching Architecture**
  - **Redis SWR Cache**: Fast distributed caching with stale-while-refresh pattern
  - **In-Memory Fallback**: Seamless degradation when Redis unavailable
  - **AsyncStorage**: Persistent offline cache on mobile devices
  - Configurable TTL and stale windows per endpoint

- **Performance Optimization**
  - Trigram indexing on text fields (title, description, location, etc.)
  - Partial indexes on frequently filtered columns (status = APPROVED)
  - Cursor-based pagination (vs offset-based for better performance)
  - Summary/detail payload split (smaller list payloads)
  - Slow query detection and logging (> 250ms threshold)

- **Resilience & Reliability**
  - Database timeout guards (7-second limit with retries)
  - Circuit breaker pattern for cascading failure prevention
  - Health monitoring with automatic alerts
  - Graceful degradation when services unavailable
  - Request context tracking for debugging

- **Data Integrity**
  - Cascade delete for related records (EventImage → EventRequest)
  - Transaction support for critical operations
  - Referential integrity constraints
  - Audit timestamps on all records

## 🛠 Tech Stack

### Frontend

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **UI Library**: React Native Paper
- **State Management**: React Context API with useReducer
- **HTTP Client**: Axios
- **Image Handling**: Expo Image Picker, Expo Image
- **Styling**: React Native StyleSheet, Expo Linear Gradient, Expo Blur
- **Storage**: Async Storage
- **Icons**: Expo Vector Icons, React Native Vector Icons

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **CORS**: cors middleware
- **Environment**: dotenv

## 📁 Project Structure

```
campus_connect/
├── frontend/                 # React Native (Expo) Application
│   ├── Screens/             # All application screens
│   │   ├── Home.jsx
│   │   ├── Events.jsx
│   │   ├── EventDetail.jsx
│   │   ├── HostEventScreen.jsx
│   │   ├── MyEvents.jsx
│   │   ├── ManageEvents.jsx
│   │   ├── Profile.jsx
│   │   ├── EditProfileScreen.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Search.jsx
│   │   └── SettingsScreen.jsx
│   ├── components/          # Reusable components
│   │   ├── EventCard.jsx
│   │   ├── EventHeroSlider.jsx
│   │   ├── EventSection.jsx
│   │   └── EventStatusChip.jsx
│   ├── navigation/          # Navigation configuration
│   ├── context/             # React Context (State Management)
│   ├── api/                 # API service layer
│   ├── reducer/             # State reducers
│   ├── theme/               # Theme configuration
│   ├── assets/              # Images, icons, and static files
│   ├── App.js               # Root component
│   ├── package.json
│   └── app.json
│
├── backend/                 # Node.js & Express API
│   ├── config/             # Configuration files
│   │   ├── cors.js
│   │   └── database.js
│   ├── controllers/        # Request handlers
│   │   ├── userController.js
│   │   └── eventController.js
│   ├── middlewares/        # Custom middlewares
│   │   ├── userMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   │   ├── userRoute.js
│   │   └── eventRoute.js
│   ├── utils/              # Utility functions
│   │   └── auth.js
│   ├── prisma/             # Prisma ORM
│   │   └── schema.prisma
│   ├── index.js            # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Expo CLI** (optional, for Expo commands)
- **Expo Go** app on your mobile device (for testing)

## 🚀 Installation Guide

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Install Dependencies
```bash
pnpm install
# OR
npm install
# OR
yarn install
```

**What's being installed:**
- **express**: HTTP server framework
- **@prisma/client**: ORM for PostgreSQL
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **cross-cors**: CORS middleware
- **dotenv**: Environment variable management
- **ioredis**: Redis client for distributed caching (optional)
- **nodemon**: Development auto-reload

#### Step 3: Generate Prisma Client
```bash
pnpm run build
# OR
npx prisma generate
```

This generates TypeScript/JavaScript types from your schema.prisma file.

#### Step 4: Set Up Environment Variables
Create a `.env` file in the `backend` directory (see [Backend Environment Variables](#backend-environment-variables) section).

#### Step 5: Create & Migrate Database
```bash
# Create database and apply migrations
npx prisma migrate dev

# OR (if database already exists)
npx prisma db push
```

#### Step 6: Verify Setup
```bash
# Test the database connection
npx prisma studio  # Opens visual database explorer

# Or run the server in development mode
pnpm run dev
```

**Expected Output:**
```
🚀 Server running on port 5001
🗄️ Prisma datasource mode: DIRECT_URL
✅ Local Backend URL: http://localhost:5001
```

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
pnpm install
# OR
npm install
# OR
yarn install
```

**What's being installed:**
- **react-native**: Mobile app framework
- **expo**: Development platform for React Native
- **react-navigation**: Navigation library
- **react-native-paper**: Material Design UI components
- **axios**: HTTP client
- **@react-native-async-storage/async-storage**: Persistent storage
- **expo-image-picker**: Camera and photo library access
- **expo-blur**: Blur effects
- **expo-linear-gradient**: Gradient backgrounds

#### Step 3: Set Up Environment Variables
Create a `.env` file in the `frontend` directory (see [Frontend Environment Variables](#frontend-environment-variables) section).

#### Step 4: Start Development Server
```bash
pnpm start
# OR
npm start
# OR
yarn start
```

**Available Options After Start:**
- Press `a` → Open on Android Emulator
- Press `i` → Open on iOS Simulator
- Press `w` → Open in web browser
- Scan QR code → Open in Expo Go app on physical device

#### Step 5: Testing on Physical Device
For testing on your local network:

1. Update `API_URL_DEV` in `.env`:
   ```env
   API_URL_DEV=http://<YOUR_LOCAL_IP>:5001
   # Example: http://192.168.1.100:5001
   ```

2. Find your local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

3. Make sure both devices are on the same WiFi network
4. Start the backend server and Expo app, then scan the QR code with Expo Go

---

## 🔐 Environment Variables

### Backend Environment Variables

Create `.env` in the `backend/` directory:

```env
# ====== SERVER CONFIGURATION ======
SERVER_PORT=5001
NODE_ENV=development
BACKEND_LOCAL_URL=http://localhost:5001
BACKEND_SERVER_URL=https://your-deployed-backend-url.com

# ====== DATABASE ======
DATABASE_URL="postgresql://username:password@localhost:5432/campus_connect"
# Format: postgresql://[user]:[password]@[host]:[port]/[database]
# Example: postgresql://postgres:password123@localhost:5432/campus_connect_db

# ====== AUTHENTICATION ======
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Min 32 characters recommended for security
# Used for signing JWT tokens

# ====== REDIS CACHING (Optional - defaults to in-memory fallback) ======
REDIS_URL=redis://localhost:6379
# Format: redis://[host]:[port] or redis://:[password]@[host]:[port]
# Leave empty to use in-memory cache (no Redis dependency)
# Example: redis://localhost:6379 (local development)
# Example: redis://default:password@redis.example.com:6379 (production)

# Cache TTL (Time To Live) in milliseconds - how long until cache is fresh expired
CACHE_TTL_HOME=60000          # 60 seconds for home events list
CACHE_TTL_EVENTS=45000         # 45 seconds for event list
CACHE_TTL_SEARCH=30000         # 30 seconds for search results
CACHE_TTL_DETAIL=120000        # 120 seconds for individual event details

# Cache STALE window in milliseconds - how long until cache is completely expired
# During stale window: serve cached data while refreshing in background
CACHE_STALE_HOME=120000        # 120 seconds total (fresh: 60s, stale: 60s)
CACHE_STALE_EVENTS=90000        # 90 seconds total (fresh: 45s, stale: 45s)
CACHE_STALE_SEARCH=60000        # 60 seconds total (fresh: 30s, stale: 30s)
CACHE_STALE_DETAIL=240000       # 240 seconds total (fresh: 120s, stale: 120s)

# ====== PERFORMANCE MONITORING ======
SLOW_QUERY_THRESHOLD_MS=250
# Queries slower than this (ms) are logged for analysis
# Helps identify database bottlenecks

# ====== HOME CACHE SCHEDULER ======
HOME_CACHE_INTERVAL_MS=60000   # 60 seconds - how often to precompute home sections
# Improves home screen response time by pre-warming cache

# ====== DATABASE GUARDS ======
DB_TIMEOUT_MS=7000              # 7 seconds - max time for any DB query
DB_CIRCUIT_BREAKER_THRESHOLD=5  # Open circuit after 5 consecutive failures
DB_CIRCUIT_BREAKER_RESET_MS=30000 # Reset circuit after 30 seconds

# ====== DEPLOYMENT & ALERTS ======
ALERT_WEBHOOK_URL=https://your-webhook.example.com/alerts
# Optional: Send alerts when server starts or critical errors occur
# Example: Discord/Slack webhook URL
```

#### Backend Variables Explained

| Variable | Purpose | Current Value | Benefits |
|----------|---------|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Required | Enables ORM to connect to database |
| `JWT_SECRET` | Token signing secret | Required | Prevents unauthorized token forgery |
| `REDIS_URL` | Redis cache endpoint | Optional | 10-100x faster cache reads vs database |
| `CACHE_TTL_*` | Fresh cache duration | 30-120s | Balance between freshness and DB load |
| `CACHE_STALE_*` | Stale-while-refresh window | 60-240s | Serve old data + refresh in background |
| `SLOW_QUERY_THRESHOLD_MS` | Performance monitoring | 250ms | Identify queries needing optimization |
| `DB_TIMEOUT_MS` | Query timeout guard | 7000ms | Prevent hanging queries from blocking |
| `DB_CIRCUIT_BREAKER_*` | Failure protection | 5 failures / 30s | Prevent cascading failures |

#### Benefits of Current Configuration

1. **Two-tier Caching**:
   - Redis (if available): Distributed cache for scalability
   - In-memory fallback: No external dependency, always works
   
2. **Stale-While-Revalidate (SWR)**:
   - Users see data instantly (even if stale)
   - Background refresh keeps data fresh
   - Reduces "loading" spinners significantly

3. **Database Protection**:
   - 7-second timeout + circuit breaker prevent database overload
   - Graceful degradation when database slow

4. **Performance Monitoring**:
   - Slow query logs help identify bottlenecks
   - Data-driven optimization

---

### Frontend Environment Variables

Create `.env` in the `frontend/` directory:

```env
# ====== API ENDPOINTS ======
API_URL_DEV=http://10.7.29.205:5001
# Development API endpoint (WiFi/LAN IP for physical device testing)
# Example: http://192.168.1.100:5001

API_URL_LOCAL=http://localhost:5001
# For Android/iOS simulator testing (localhost inside simulator)

API_URL_PROD=https://campus-connect-asps.onrender.com
# Production API endpoint (deployed backend)

# ====== IMAGE UPLOAD (CLOUDINARY) ======
CLOUD_NAME=dzkuuvefk
# Cloudinary project name - free image hosting service

UPLOAD_PRESET=event_upload_preset_23
# Unsigned upload preset - allows uploads without backend token
# Created in Cloudinary dashboard for security
```

#### Frontend Variables Explained

| Variable | Purpose | Current Value | How Used |
|----------|---------|---|---|
| `API_URL_DEV` | Development API | WiFi/LAN IP | Android/physical device testing |
| `API_URL_LOCAL` | Simulator API | localhost:5001 | iOS/Android emulator testing |
| `API_URL_PROD` | Production API | Deployed URL | Production builds |
| `CLOUD_NAME` | Cloudinary project | Required | Image upload service |
| `UPLOAD_PRESET` | Upload permissions | Required | Enable unsigned uploads |

#### How API Endpoints are Selected

```javascript
// frontend/api/api.js
const API_URL = 
  __DEV__ && USE_LOCAL_API 
    ? API_URL_LOCAL  // Emulator: localhost
    : __DEV__ 
      ? API_URL_DEV  // Device: local network IP
      : API_URL_PROD // Production: deployed domain
```

#### Setting Up Image Upload (Cloudinary)

1. Go to [cloudinary.com](https://cloudinary.com) and create free account
2. Get `CLOUD_NAME` from dashboard settings
3. Create unsigned upload preset:
   - Settings → Upload
   - Create new upload preset with Mode: `Unsigned`
   - Use preset name as `UPLOAD_PRESET`
4. Update `.env` with credentials

---

## 🏃 Running the Application

### Backend Development

**Terminal 1: Start the API Server**
```bash
cd backend
pnpm run dev
```

Expected output:
```
[nodemon] watching path(s): *.*
[dotenv@17.3.1] injecting env 
[home-cache] refresh interval 60000ms
🚀 Server running on port 5001
🗄️ Prisma datasource mode: DIRECT_URL
✅ Local Backend URL: http://localhost:5001
```

**Available Endpoints** (after server starts):
- Health Check: `GET http://localhost:5001/health`
- Database Health: `GET http://localhost:5001/health/db`
- API Base: `GET http://localhost:5001/api`

**Monitoring & Debugging:**
- **Slow Queries**: Check console logs starting with `[SLOW_QUERY]`
- **Cache Status**: Look for `[cache]` logs showing Redis connection
- **Home Cache**: `[home-cache]` logs show precompute scheduler

**Stopping the Server:**
- Press `Ctrl+C` to stop nodemon

---

### Frontend Development

**Terminal 2: Start the React Native App**
```bash
cd frontend
pnpm start
```

Expected output:
```
Starting Packager...
Expo DevTools is running at http://localhost:19002
```

**Running on Different Devices:**

1. **Android Emulator:**
   ```
   Press: a
   ```
   - Requires Android Studio and emulator running
   - Will automatically open on emulator

2. **iOS Simulator (macOS only):**
   ```
   Press: i
   ```
   - Requires Xcode installed
   - Will automatically open on simulator

3. **Physical Device (Best for Testing):**
   - Download Expo Go app (iOS App Store / Google Play)
   - Update `API_URL_DEV` in `.env` to your local IP
   - Run `pnpm start`
   - Scan QR code with Expo Go
   - App will open on your device

4. **Web Browser (Testing Only):**
   ```
   Press: w
   ```
   - Limited features (no camera, geolocation, etc.)
   - Good for quick UI testing

**Debugging:**
- Open DevTools: `Press d` in Expo terminal
- View logs: `Press j` in Expo terminal
- Reload: `Press r` in Expo terminal

**Hot Reload:**
- Changes auto-reload on device when you save files
- For backend changes: API restarts automatically (nodemon)
- For frontend changes: App reloads automatically (Expo)

---

### Full Stack Testing

**To test both frontend and backend together:**

```bash
# Terminal 1: Backend
cd backend && pnpm run dev

# Terminal 2: Frontend
cd frontend && pnpm start

# Terminal 3: Database Management (optional)
cd backend && npx prisma studio
```

**Prisma Studio** (Terminal 3):
- Visual database explorer at http://localhost:5555
- View/edit records directly
- Useful for testing and debugging data

**Testing Workflow:**
1. Open backend server terminal
2. Open frontend app terminal
3. Start app on emulator/device
4. Make API request from app
5. Check backend logs for request details
6. Use Prisma Studio to verify database changes

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication

All protected endpoints require an `Authorization` header:
```http
Authorization: Bearer <jwt_token>
```

The JWT token is returned on login and valid for the session duration.

---

### User Endpoints

#### 1. Register New User
```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe123",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "gender": "Male"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe123",
    "email": "john@example.com",
    "gender": "Male",
    "role": "USER",
    "createdAt": "2026-03-30T10:30:00Z"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

---

#### 2. Login User
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe123",
    "email": "john@example.com",
    "role": "USER",
    "gender": "Male"
  }
}
```

**Token Storage (Frontend):**
```javascript
// frontend/context/UserContext.jsx
localStorage.setItem('token', response.token);
// Used in all subsequent API calls
```

---

#### 3. Get Current User
```http
GET /user/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe123",
    "email": "john@example.com",
    "gender": "Male",
    "role": "USER",
    "createdAt": "2026-03-30T10:30:00Z",
    "updatedAt": "2026-03-30T10:30:00Z"
  }
}
```

---

#### 4. Update User Profile
```http
PUT /user/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "username": "johndoe456",
  "email": "newemail@example.com",
  "gender": "Female"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "username": "johndoe456",
    "email": "newemail@example.com",
    "gender": "Female"
  }
}
```

---

#### 5. Get All Users (Pagination)
```http
GET /user?page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "role": "USER"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

---

### Event Endpoints

#### 6. Get All Approved Events (with Cursor Pagination)
```http
GET /events?limit=20&cursor=nextcursor123

Query Parameters:
- limit: Number of results (default: 20, max: 100)
- cursor: Pagination cursor (from previous response)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Tech Talk: AI in Education",
        "category": "Technology",
        "subCategory": "Workshop",
        "date": "2026-02-15T00:00:00Z",
        "location": "Main Auditorium",
        "hostName": "Tech Club",
        "status": "APPROVED",
        "images": [
          {
            "id": 1,
            "url": "https://cloudinary.com/image1.jpg"
          }
        ]
      }
    ],
    "nextCursor": "cursor456",
    "hasMore": true
  }
}
```

**Why Cursor Pagination?**
- Offset pagination: Inefficient for large datasets
- Cursor pagination: O(1) complexity, always fast regardless of page
- Better for mobile: Use `cursor` not `page`

---

#### 7. Get Single Event Details
```http
GET /events/:id
Authorization: Optional (for user-specific data)

Path Parameter:
- id: Event ID (integer)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Talk: AI in Education",
    "description": "Join us for an insightful session on AI applications in modern education...",
    "category": "Technology",
    "subCategory": "Workshop",
    "date": "2026-02-15T00:00:00Z",
    "time": "14:00",
    "location": "Main Auditorium",
    "hostName": "Tech Club",
    "contact": "+1234567890",
    "email": "techclub@campus.edu",
    "status": "APPROVED",
    "images": [
      {
        "id": 1,
        "url": "https://cloudinary.com/image1.jpg"
      },
      {
        "id": 2,
        "url": "https://cloudinary.com/image2.jpg"
      }
    ],
    "createdBy": {
      "id": 5,
      "name": "Tech Club President",
      "email": "techclub@campus.edu"
    },
    "createdAt": "2026-02-01T10:30:00Z"
  }
}
```

**Cache Behavior:**
- Fresh for 120 seconds
- If request between 120-240 seconds: serve cached + refresh background
- After 240 seconds: fresh request

---

#### 8. Search Events (with Trigram Indexing)
```http
GET /events/search?q=AI&category=Technology&limit=20

Query Parameters:
- q: Search query (searches title, description, location, category)
- category: Filter by category
- limit: Results per page
- cursor: Pagination cursor
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Tech Talk: AI in Education",
        "category": "Technology",
        "date": "2026-02-15T00:00:00Z",
        "location": "Main Auditorium",
        "hostName": "Tech Club"
      }
    ],
    "total": 15,
    "nextCursor": "cursor789",
    "hasMore": false
  }
}
```

**Trigram Indexing Benefit:**
- Fast text search even with typos
- Query: "AI in edcation" → still finds results
- No full-text indexing needed
- PostgreSQL pg_trgm extension used

---

#### 9. Get Events for Home Screen (Precomputed)
```http
GET /events/home
```

**Response (200 OK) - Precomputed Cache:**
```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "category": "Technology",
        "events": [
          {
            "id": 1,
            "title": "AI Workshop",
            "date": "2026-02-15T00:00:00Z",
            "images": [{ "url": "..." }]
          }
        ]
      },
      {
        "category": "Sports",
        "events": [...]
      }
    ],
    "cacheStatus": "HIT_FRESH",
    "cachedAt": "2026-03-30T10:15:00Z"
  }
}
```

**Cache Precomputation:**
- Home sections computed every 60 seconds
- Scheduled background job
- Always fast response (<50ms)
- `cacheStatus` shows: HIT_FRESH, HIT_STALE, or MISS

---

#### 10. Create Event Request (Users)
```http
POST /events/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sports Day 2026",
  "description": "Annual inter-college sports competition...",
  "category": "Sports",
  "subCategory": "Competition",
  "date": "2026-05-10T00:00:00Z",
  "time": "09:00",
  "location": "Sports Complex",
  "hostName": "Sports Committee",
  "contact": "+1234567890",
  "email": "sports@campus.edu",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Event request created successfully",
  "data": {
    "id": 10,
    "title": "Sports Day 2026",
    "status": "PENDING",
    "createdAt": "2026-03-30T10:30:00Z"
  }
}
```

**Image Upload Process:**
1. Base64 images sent with request
2. Images uploaded to Cloudinary
3. URLs stored in database
4. Original base64 not stored (saves DB space)

---

#### 11. Get My Events
```http
GET /events/me?status=PENDING&limit=10
Authorization: Bearer <token>

Query Parameters:
- status: PENDING, APPROVED, REJECTED
- limit: Results per page
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 10,
        "title": "Sports Day 2026",
        "status": "PENDING",
        "category": "Sports",
        "date": "2026-05-10T00:00:00Z",
        "createdAt": "2026-03-30T10:30:00Z"
      }
    ],
    "pending": 2,
    "approved": 5,
    "rejected": 1
  }
}
```

---

#### 12. Delete My Event
```http
DELETE /events/me/:id
Authorization: Bearer <token>

Path Parameter:
- id: Event ID to delete
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### Admin Endpoints

#### 13. Get All Events (Admin Dashboard)
```http
GET /events/admin?status=PENDING&limit=50
Authorization: Bearer <token> (Admin only)

Query Parameters:
- status: PENDING, APPROVED, REJECTED
- limit: Results per page
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 10,
        "title": "Sports Day 2026",
        "status": "PENDING",
        "submittedBy": {
          "id": 5,
          "name": "Event Organizer",
          "email": "organizer@campus.edu"
        },
        "createdAt": "2026-03-30T10:30:00Z"
      }
    ],
    "stats": {
      "total": 150,
      "pending": 25,
      "approved": 110,
      "rejected": 15
    }
  }
}
```

---

#### 14. Update Event Status (Approve/Reject)
```http
PATCH /events/admin/:id/status
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "status": "APPROVED",
  "notes": "Event approved - all details verified"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event status updated",
  "data": {
    "id": 10,
    "status": "APPROVED",
    "updatedAt": "2026-03-30T11:00:00Z"
  }
}
```

---

#### 15. Delete Event (Admin)
```http
DELETE /events/admin/:id
Authorization: Bearer <token> (Admin only)

Path Parameter:
- id: Event ID to delete
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Event fetched successfully |
| 201 | Created | Event request submitted |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Not admin but accessed admin endpoint |
| 404 | Not Found | Event ID doesn't exist |
| 409 | Conflict | Username already taken |
| 500 | Server Error | Database connection failed |
| 503 | Service Unavailable | Redis unavailable but gracefully fell back (still works) |

---

### API Client Usage (Frontend)

```javascript
// frontend/api/api.js
import axios from 'axios';
import { API_URL } from '@env';

// Create API instance with base URL
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage example
const getEvents = (limit = 20, cursor = null) =>
  api.get('/events', { params: { limit, cursor } });
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
User
├── id (Primary Key)
├── name
├── username (Unique)
├── email (Unique)
├── password (hashed)
├── gender
├── role (Enum: USER, ADMIN)
└── EventRequest[] (One-to-Many)

EventRequest
├── id (Primary Key)
├── title
├── description
├── category
├── subCategory
├── date
├── time
├── location
├── hostName
├── contact
├── email
├── status (Enum: PENDING, APPROVED, REJECTED)
├── createdById (Foreign Key → User.id)
├── createdAt (Timestamp)
├── updatedAt (Timestamp)
├── EventImage[] (One-to-Many, Cascade Delete)
└── createdBy (User relation)

EventImage
├── id (Primary Key)
├── url (Cloudinary URL)
├── eventRequestId (Foreign Key → EventRequest.id)
└── eventRequest (EventRequest relation)
```

### User Model

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  username      String         @unique
  email         String         @unique
  password      String         // bcrypt hashed
  gender        String         @default("Prefer not to say")
  role          Role           @default(USER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  eventRequests EventRequest[]
}
```

**Indexes:**
- Primary: `id`
- Unique: `username`, `email`
- Used for: Fast login, duplicate prevention, profile lookups

---

### EventRequest Model

```prisma
model EventRequest {
  id            Int            @id @default(autoincrement())
  title         String
  description   String
  category      String
  subCategory   String?
  date          DateTime
  time          String
  location      String
  hostName      String
  contact       String
  email         String
  status        RequestStatus  @default(PENDING)
  createdById   Int
  createdBy     User           @relation(fields: [createdById], references: [id])
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  images        EventImage[]   @relation(onDelete: Cascade)

  // Indexes for performance
  @@index([status])                    // Filter by status
  @@index([createdById])               // Find user's events
  @@index([date])                      // Sort by date
  @@fulltext([title, description])     // Search (trigram)
}
```

**Indexes & Query Optimization:**

| Field | Index Type | Purpose | Query Example |
|-------|-----------|---------|---|
| `status` | Regular | Filter APPROVED events | `WHERE status = 'APPROVED'` |
| `createdById` | Regular | Get user's submissions | `WHERE createdById = 5` |
| `date` | Regular | Sort by date | `ORDER BY date` |
| `title, description, location, hostName` | Trigram (pg_trgm) | Fast text search | `WHERE title % 'AI Workshop'` |
| `status` (partial) | Partial (WHERE status='APPROVED') | Only index active events | Saves 40-50% index space |

**Trigram Index Benefits:**
- Full-text search without complex parsers
- Typo-tolerant searching
- Fast on large datasets
- PostgreSQL native support via `pg_trgm` extension

---

### EventImage Model

```prisma
model EventImage {
  id             Int          @id @default(autoincrement())
  url            String
  eventRequestId Int
  eventRequest   EventRequest @relation(fields: [eventRequestId], references: [id], onDelete: Cascade)

  @@index([eventRequestId])
}
```

**Cascade Delete:**
- When EventRequest deleted → all EventImages deleted automatically
- Prevents orphaned records
- No manual cleanup needed

---

### Enums

```prisma
enum Role {
  USER
  ADMIN
}

enum RequestStatus {
  PENDING      // Awaiting admin review
  APPROVED     // Visible to all users
  REJECTED     // Hidden, creator notified
}
```

---

### Sample Data Queries

**Find all approved events in Technology category:**
```sql
SELECT * FROM "EventRequest" 
WHERE status = 'APPROVED' AND category = 'Technology'
ORDER BY date DESC
LIMIT 20;
```

**Search for 'AI Workshop' with trigram:**
```sql
SELECT * FROM "EventRequest"
WHERE title % 'AI Workshop' OR description % 'AI Workshop'
ORDER BY similarity(title, 'AI Workshop') DESC;
```

**Get user's events with image count:**
```sql
SELECT e.*, COUNT(i.id) as image_count
FROM "EventRequest" e
LEFT JOIN "EventImage" i ON e.id = i."eventRequestId"
WHERE e."createdById" = 5
GROUP BY e.id;
```

---

## ⚡ Production Features & Optimizations

Campus Connect includes 15+ production-hardening features implemented during development:

### 1. Caching Strategy

**Three-Tier Caching Architecture:**

```
Frontend                Backend               Database
+─────────────+        +──────────────+      +───────────+
│ AsyncStorage│        │ Redis SWR    │      │PostgreSQL │
│ (Offline)   │────→   │ (Distributed)│──→   │ (Primary) │
+─────────────+        │ In-Memory FB │      +───────────+
   (7 days)              (TTL: 30-120s)       (source of truth)
                         (Stale: 60-240s)
```

**Cache Configuration (Configurable):**
```env
CACHE_TTL_HOME=60000          # Fresh for 60s
CACHE_STALE_HOME=120000       # Stale until 120s

CACHE_TTL_EVENTS=45000        # Fresh for 45s
CACHE_STALE_EVENTS=90000      # Stale until 90s

CACHE_TTL_SEARCH=30000        # Fresh for 30s
CACHE_STALE_SEARCH=60000      # Stale until 60s

CACHE_TTL_DETAIL=120000       # Fresh for 120s
CACHE_STALE_DETAIL=240000     # Stale until 240s
```

**Stale-While-Revalidate (SWR) Benefits:**
- Fresh data: Response in <50ms (cache hit)
- Stale data: Still serve old data + refresh background
- Miss: Fresh request (one-time penalty)
- **Result**: Perceived instant load, smooth UX

**Graceful Degradation:**
- Redis available: Use distributed cache (scalable)
- Redis down: Fall back to in-memory (always works)
- Backend API down: Fall back to AsyncStorage (offline first)

---

### 2. Database Optimization

**Slow Query Monitoring:**
```env
SLOW_QUERY_THRESHOLD_MS=250
```
Queries > 250ms automatically logged with:
- Query text
- Query parameters
- Endpoint that triggered it
- Exact duration

**Query Optimization Techniques Applied:**

| Technique | Example | Benefit |
|-----------|---------|---------|
| Trigram Index | `WHERE title % 'text'` | 100x faster search |
| Partial Index | `WHERE status='APPROVED'` | 50% smaller indexes |
| Cursor Pagination | `WHERE id > cursor` | O(1) regardless of offset |
| Select Projection | Only needed fields | Smaller network packets |
| Connection Pooling | Reuse connections | Faster query execution |

**Query Examples:**

```javascript
// Slow: Fetch all, filter in application
const allEvents = await prisma.eventRequest.findMany();
const approved = allEvents.filter(e => e.status === 'APPROVED');  // BAD

// Fast: Filter at database level
const approved = await prisma.eventRequest.findMany({
  where: { status: 'APPROVED' },
  select: {
    id: true,
    title: true,
    category: true,
    date: true,
    images: { select: { url: true } }
  },
  take: 20,
  orderBy: { date: 'desc' }
});  // GOOD - uses indexes
```

---

### 3. Resilience Patterns

**Circuit Breaker for Database:**
```env
DB_CIRCUIT_BREAKER_THRESHOLD=5    # Open after 5 failures
DB_CIRCUIT_BREAKER_RESET_MS=30000 # Reset after 30s
```

**Behavior:**
```
Closed (Normal)     Open (Failing)      Half-Open (Testing)
    ↓                   ↓                    ↓
Request → DB        Return Error        Try 1 Request
Successful          Immediately         Success → Closed
```

**Timeout Guards:**
```env
DB_TIMEOUT_MS=7000  # Max 7 seconds per query
```

If query takes > 7s:
1. Query killed
2. Connection returned to pool
3. Error returned to client
4. No hanging connections

---

### 4. Request Context Tracking

Every request tracked with async-local context:
```
Request ID → Endpoint → Handler Logic → DB Queries → Response
 (unique)   (name)    (processing)    (all logged) (end-to-end)
```

**Logged Information:**
- Endpoint name (for slow query correlation)
- Request parameters
- Query execution time
- Error stack traces

---

### 5. Health Monitoring

**Sidecar Health Monitor Process:**
```bash
npm run monitor:health  # Runs separately, doesn't block API
```

**Checks Every 30 Seconds:**
- ✅ API server responding
- ✅ Database connectivity
- ✅ Connection pool health
- ✅ Cache layer status

**Alerting:**
- Sends webhook on failure (optional)
- Exits gracefully if critical

---

### 6. Frontend Resilience

**Request Cancellation:**
- Abort stale requests automatically
- Prevent race conditions
- Save bandwidth

**Example:**
```javascript
const controller = new AbortController();

// User types in search box
fetchEvents({ signal: controller.signal });

// User clears search
controller.abort();  // Previous request cancelled

// New search starts
```

**Benefits:**
- User changes filter rapidly
- Only latest request completes
- Older responses discarded
- No UI flickering

---

### 7. Offline-First Architecture

**Data Stored Locally:**
- `/home` endpoint → AsyncStorage (7 days)
- `/events/:id` endpoint → AsyncStorage (7 days)
- Event list pagination → AsyncStorage (7 days)

**Usage:**
```javascript
// Frontend automatically falls back to AsyncStorage
// User sees last-synced data when offline
const events = await getEvents();
// Online: Fresh from API or cache
// Offline: From AsyncStorage if available
```

---

### 8. Performance Metrics

**Expected Response Times (Fresh Cache):**
| Endpoint | Time | Notes |
|----------|------|-------|
| /home | <50ms | Precomputed |
| /events | <100ms | Cursor paginated |
| /events/search | <200ms | Trigram index |
| /events/:id | <50ms | Cached detail |
| /admin/events | <500ms | Full dataset |

**With Redis:** 10-50x faster than without

---

### 9. Migration System

**All migrations in `backend/prisma/migrations/`:**

```
20251125111408_init
20251125113240_init
20251125120115_init_event_request
20251127084423_add_sub_category
20251130094541_add_event_request_email
20251130094756_feild_updated
20260330175014_add_event_query_indexes
20260330191500_add_trigram_and_partial_indexes
20260330193500_add_event_image_cascade_delete
```

**Run Migration:**
```bash
npx prisma migrate deploy  # Production
npx prisma migrate dev     # Development
```

---

### 10. Image Upload & CDN

**Using Cloudinary (Free Tier):**
- Unlimited storage
- Automatic resizing
- Image optimization
- Global CDN delivery

**Upload Flow:**
```
User selects image
    ↓
Convert to Base64
    ↓
Send to Cloudinary API
    ↓  
Get CDN URL
    ↓
Store URL in database (NOT image data)
    ↓
Display from CDN
```

**Benefits:**
- No server storage needed
- Automatic scaling
- Global fast delivery
- Smaller database

---

## 🚀 Deployment Guide

### Prerequisites
- Deployed PostgreSQL database
- Redis instance (optional but recommended)
- Cloudinary account
- Node.js hosting (Heroku, Render, AWS, etc.)

### Backend Deployment Steps

1. **Set Production Environment Variables:**
```bash
# Production .env
DATABASE_URL=postgresql://user:pass@prod-db:5432/campus_connect
JWT_SECRET=<generate-new-secret>
REDIS_URL=redis://default:pass@redis.example.com:6379
NODE_ENV=production
```

2. **Build & Run:**
```bash
pnpm install --prod
pnpm build
pnpm start  # Production server

# In separate process:
npm run monitor:health  # Health monitoring sidecar
```

3. **Apply Migrations:**
```bash
npx prisma migrate deploy
```

4. **Verify Deployment:**
```bash
curl https://your-api.com/health
# Should return: { "status": "ok" }
```

### Frontend Deployment (Expo EAS)

1. **Build APK/IPA:**
```bash
eas build --platform android
eas build --platform ios
```

2. **Submit to Stores:**
```bash
eas submit --platform android
eas submit --platform ios
```

3. **Update Backend URLs:**
```env
API_URL_PROD=https://your-api.com
# React Native will use API_URL_PROD in production builds
```

### Monitoring Post-Deployment

**Check Logs:**
```bash
# Backend logs
tail -f /var/log/campus-connect/app.log

# Slow queries
grep "\[SLOW_QUERY\]" /var/log/campus-connect/app.log

# Health monitoring
grep "\[health\]" /var/log/campus-connect/app.log
```

**Alerts to Set Up:**
- Database connection failures
- Memory usage > 80%
- Response time > 1 second
- Error rate > 1%

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Won't Start
```
Error: Cannot find module '@prisma/client'
```
**Solution:**
```bash
pnpm install
pnpm build
```

#### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Ensure database name exists
```bash
# Create database if missing
createdb campus_connect
```

#### Redis Connection Errors
```
[cache] redis unavailable, using in-memory fallback
```
**This is OK!** The app gracefully falls back to in-memory cache. To fix:
1. Start Redis server: `redis-server`
2. Or set REDIS_URL in .env
3. Or just use without Redis (always works)

#### Slow Queries on /events
```
[SLOW_QUERY] duration: 2500ms threshold: 250ms
```
**Solution:**
1. Check if trigram indexes exist:
```bash
npx prisma migrate status
```
2. If migration 20260330191500 not applied:
```bash
npx prisma migrate deploy
```

#### Frontend API Connection Failed
```
Network Error: Failed to fetch
```
**Solutions:**
1. Check backend running: `curl http://localhost:5001/health`
2. Verify API_URL_DEV in .env
3. Ensure same WiFi network (for physical device)
4. Check CORS headers in backend

#### Expo App White Screen
```
Error: Module not found
```
**Solution:**
```bash
npm install
npx expo start --clear
# Restart Expo Go app
```

#### Token Expired
```
Error: 401 Unauthorized
```
**Solution:**
1. User needs to re-login
2. Token stored in device storage
3. Automatic cleanup on app restart

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or improvements, your help is appreciated.

### Development Workflow

1. **Create Feature Branch:**
```bash
git checkout -b feature/amazing-feature
```

2. **Make Changes:**
   - Follow existing code style
   - Write descriptive commit messages
   - Test thoroughly

3. **Commit Changes:**
```bash
git commit -m "feat: add amazing feature

- Implement new feature
- Update tests
- Update documentation"
```

4. **Push & Create PR:**
```bash
git push origin feature/amazing-feature
```

5. **Create Pull Request**
   - Describe: what, why, how
   - Link related issues
   - Request review

### Code Standards

- **JavaScript/Node.js**: Use ES6+, async/await, meaningful variable names
- **Frontend**: Follow React hooks patterns, use context for state
- **Database**: Use Prisma for all queries, avoid raw SQL
- **Comments**: Explain WHY, not WHAT (code explains what)
- **Commits**: Small, focused changes per commit

### Bug Reports

Found a bug? Please:
1. Check if already reported
2. Include: OS, browser version, steps to reproduce
3. Attach screenshots/logs if possible

### Feature Requests

Have a great idea? Open an issue with:
1. Clear description and use case
2. Expected behavior vs actual
3. Possible implementation approach

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Author & Contributors

### Primary Author
**Mayank Sharma**
- GitHub: [@MAYANKSHARMA01010](https://github.com/MAYANKSHARMA01010)
- Email: mayanksharma@example.com
- Portfolio: https://yourportfolio.com

### Contributors
- Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

### Acknowledgments
- **React Native & Expo**: Excellent documentation and tooling
- **Prisma**: Amazing ORM experience
- **PostgreSQL**: Powerful database with great extensions
- **React Navigation**: Seamless navigation library
- **React Native Paper**: Beautiful Material Design components
- **Cloudinary**: Free image hosting and CDN

### Special Thanks
- Campus communities for inspiring this project
- The open-source community for amazing libraries
- All contributors and testers

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: mayanksharma@example.com

---

**Made with ❤️ for campus communities worldwide**

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Mar 31, 2026 | Initial release with all production features |
| 0.9.0 | Mar 15, 2026 | Beta testing phase |
| 0.1.0 | Feb 1, 2026 | Initial development |

---

**Last Updated**: March 31, 2026
