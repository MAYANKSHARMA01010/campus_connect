# Campus Connect API Reference

Complete API documentation with examples for all endpoints.

## Getting Started

**Base URL:**
```
http://localhost:5001/api
```

**Authentication:**
All protected endpoints require JWT token:
```http
Authorization: Bearer <jwt_token>
```

**Content-Type:**
```http
Content-Type: application/json
```

---

## User Authentication Endpoints

### 1. Register User

Create a new user account.

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

**Success Response (201):**
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

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

**Validation Rules:**
- Name: Required, min 2 characters
- Username: Required, unique, alphanumeric
- Email: Required, valid email, unique
- Password: Required, min 6 characters
- Gender: Optional (default: "Prefer not to say")

---

### 2. Login User

Authenticate and receive JWT token.

```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
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
    "gender": "Male",
    "role": "USER"
  }
}
```

**Token Usage:**
```javascript
// Save token
localStorage.setItem('token', response.token);

// Use in subsequent requests
fetch('/api/events/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

### 3. Get Current User

Retrieve authenticated user information.

```http
GET /user/me
Authorization: Bearer <token>
```

**Response (200):**
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

### 4. Update User Profile

Update user information.

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

**Response (200):**
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

### 5. Get All Users

List all registered users (pagination).

```http
GET /user?page=1&limit=20
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)

**Response (200):**
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
        "role": "USER",
        "createdAt": "2026-03-30T10:30:00Z"
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

## Event Endpoints

### 6. Get All Approved Events

List all approved events with cursor pagination.

```http
GET /events?limit=20&cursor=nextcursor123
```

**Query Parameters:**
- `limit`: Results per page (default: 20, max: 100)
- `cursor`: Pagination cursor (from nextCursor field)

**Response (200):**
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
            "url": "https://cloudinary.com/..."
          }
        ]
      }
    ],
    "nextCursor": "cursor456",
    "hasMore": true,
    "cacheStatus": "HIT_FRESH"
  }
}
```

**Cursor Pagination Benefits:**
- Efficient for large datasets
- Always O(1) complexity (same speed regardless of page)
- Better than offset pagination for mobile

---

### 7. Get Event Details

Retrieve full information for a single event.

```http
GET /events/:id
```

**Path Parameter:**
- `id`: Event ID (integer)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Talk: AI in Education",
    "description": "Join us for an insightful session on AI applications...",
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
      }
    ],
    "createdBy": {
      "id": 5,
      "name": "Tech Club President",
      "email": "techclub@campus.edu"
    },
    "createdAt": "2026-02-01T10:30:00Z",
    "updatedAt": "2026-02-01T10:30:00Z"
  }
}
```

---

### 8. Search Events

Search events with trigram-powered text matching.

```http
GET /events/search?q=AI&category=Technology&limit=20&cursor=next123
```

**Query Parameters:**
- `q`: Search query (searches title, description, location)
- `category`: Filter by category (optional)
- `limit`: Results per page (default: 20)
- `cursor`: Pagination cursor (optional)

**Response (200):**
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
        "images": [{"url": "..."}]
      }
    ],
    "total": 15,
    "nextCursor": "cursor789",
    "hasMore": false,
    "cacheStatus": "HIT_STALE"
  }
}
```

**Search Features:**
- Typo-tolerant (thanks to trigram indexing)
- Fast even with large datasets
- Searches: title, description, location, hostName

---

### 9. Get Home Screen Events

Precomputed event sections for home screen.

```http
GET /events/home
```

**Response (200):**
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
            "location": "Main Auditorium",
            "images": [{"url": "..."}]
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

**Cache Status:**
- `HIT_FRESH`: Data is current (<60s old)
- `HIT_STALE`: Data is being refreshed in background
- `MISS`: Fresh request from database

---

### 10. Create Event Request

Submit a new event for approval.

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

**Response (201):**
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

**Image Upload:**
- Base64 encoded images
- Automatically uploaded to Cloudinary
- URLs stored in database
- Supports multiple images

---

### 11. Get My Events

Events submitted by current user.

```http
GET /events/me?status=PENDING&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: Filter by status (PENDING, APPROVED, REJECTED)
- `limit`: Results per page

**Response (200):**
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
    "stats": {
      "pending": 2,
      "approved": 5,
      "rejected": 1
    }
  }
}
```

---

### 12. Delete My Event

Delete a submitted event (only pending events).

```http
DELETE /events/me/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## Admin Endpoints

### 13. Get All Events (Admin)

List all events with admin filtering.

```http
GET /events/admin?status=PENDING&limit=50
Authorization: Bearer <admin_token>
```

**Requires:** Admin role

**Query Parameters:**
- `status`: PENDING, APPROVED, REJECTED
- `limit`: Results per page

**Response (200):**
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
          "name": "Organizer Name",
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

### 14. Update Event Status

Approve or reject an event.

```http
PATCH /events/admin/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "APPROVED",
  "notes": "Event approved - all details verified"
}
```

**Status Options:**
- `APPROVED`: Event visible to users
- `REJECTED`: Event hidden, user notified

**Response (200):**
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

### 15. Delete Event (Admin)

Permanently delete an event.

```http
DELETE /events/admin/:id
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## Error Responses

All errors follow standard format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

**HTTP Status Codes:**

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate username |
| 500 | Server Error | Database error |

---

## Using the API from Frontend

```javascript
// frontend/api/api.js
import axios from 'axios';
import { API_URL_PROD } from '@env';

const api = axios.create({
  baseURL: `${API_URL_PROD}/api`
});

// Auto-attach token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example usage
const response = await api.get('/events', {
  params: { limit: 20, cursor: null }
});
```

---

## Rate Limiting

Currently no rate limiting is enforced, but plan for future limits:
- 100 requests/minute per IP
- 1000 requests/hour per user
- 10MB file upload limit

---

See [docs](../) for more information.

