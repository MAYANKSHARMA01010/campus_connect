# Campus Connect Backend

This is the backend server for the Campus Connect application, built with Node.js, Express, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL installed and running

## Installation

1.  **Clone the repository** (if not already done).
2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Server Configuration
SERVER_PORT=5001
BACKEND_LOCAL_URL="http://localhost:5001"
BACKEND_SERVER_URL="https://your-production-url.com"

# Security
JWT_SECRET="your_super_secret_jwt_key"

# Optional alerting webhook for startup/monitor failures
ALERT_WEBHOOK_URL="https://hooks.example.com/services/..."

# Deployment health monitor target + interval
MONITOR_TARGET_URL="https://your-production-url.com"
HEALTH_CHECK_INTERVAL_MS=30000
HEALTH_CHECK_TIMEOUT_MS=5000

# Slow query logging threshold (ms)
SLOW_QUERY_THRESHOLD_MS=250

# Precomputed home sections refresh (1-5 minutes recommended)
HOME_SECTION_REFRESH_MS=60000
HOME_SECTION_LIMIT=120
```

## Database Setup

1.  **Generate Prisma Client**:

    ```bash
    npx prisma generate
    ```

2.  **Run Migrations** (to set up the database schema):
    ```bash
    npx prisma migrate dev --name init
    ```

## Running the Server

- **Development Mode** (with nodemon):

  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

- **Deployment Health Monitor** (run as sidecar/worker):
  ```bash
  npm run monitor:health
  ```

## API Routes

### User Routes (`/api/user`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user profile (Protected)
- `PUT /update` - Update user profile (Protected)
- `GET /` - Get all users

### Event Routes (`/api/events`)

- **Public**:

  - `GET /` - Get all events
  - `GET /home` - Get events for home screen
  - `GET /search` - Search events
  - `GET /:id` - Get single event details

- **Authenticated User**:

  - `POST /request` - Create a new event request
  - `GET /me` - Get my events
  - `DELETE /me/:id` - Delete my event

- **Admin**:
  - `GET /admin` - Get all events (for admin management)
  - `PATCH /admin/:id/status` - Update event status (Approve/Reject)
  - `DELETE /admin/:id` - Delete any event

## Folder Structure

```
.
├── prisma              # Prisma schema and migrations
└── src
  ├── config          # Configuration (DB, CORS)
  ├── controllers     # Route logic
  ├── middlewares     # Auth and validation middlewares
  ├── routes          # API route definitions
  ├── utils           # Helper functions
  └── server.js       # Entry point
```
