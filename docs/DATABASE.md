# Database Schema & Architecture

Complete guide to Campus Connect database design.

## Entity Relationship Diagram

```
┌─────────┐                      ┌──────────────────┐
│  User   │◄──── createdBy ──────┤  EventRequest    │
├─────────┤                      ├──────────────────┤
│ id (PK) │                      │ id (PK)          │
│ name    │                      │ title            │
│ username│ (1) ─────── (M)      │ description      │
│ email   │                      │ category         │
│ password│                      │ subCategory      │
│ gender  │                      │ date             │
│ role    │                      │ time             │
└─────────┘                      │ location         │
                                 │ hostName         │
                                 │ email            │
                                 │ status           │
                                 │ createdById (FK) │
                                 │ createdAt        │
                                 │ updatedAt        │
                                 └──────────────────┘
                                         │
                                         │ (1) ──── (M)
                                         │
                                 ┌──────────────────┐
                                 │  EventImage      │
                                 ├──────────────────┤
                                 │ id (PK)          │
                                 │ url              │
                                 │ eventRequestId   │
                                 │   (FK)           │
                                 └──────────────────┘
```

---

## User Model

Stores user account information.

### Schema

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String         // User's full name
  username      String         @unique           // Login identifier
  email         String         @unique           // Contact email
  password      String         // bcrypt hashed
  gender        String         @default("Prefer not to say")
  role          Role           @default(USER)    // USER or ADMIN
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  eventRequests EventRequest[] // Events created by user
}

enum Role {
  USER   // Regular user
  ADMIN  // Administrator with full access
}
```

### Indexes

| Field | Type | Purpose |
|-------|------|---------|
| `id` | Primary Key | Unique identification |
| `username` | Unique | Fast login lookup |
| `email` | Unique | Prevent duplicate registrations |

### Storage

```
id         | name       | username    | email              | gender   | role
1          | John Doe   | johndoe123  | john@example.com   | Male     | USER
2          | Admin User | admin001    | admin@campus.edu   | Female   | ADMIN
```

### Password Security

- **Algorithm**: bcrypt (salted hashing)
- **Cost Factor**: 10 (default)
- **Stored**: Never plain text, only hash
- **Verification**: Compare hash at login

---

## EventRequest Model

Stores event submissions and management.

### Schema

```prisma
model EventRequest {
  id            Int            @id @default(autoincrement())
  title         String         // Event title
  description   String         // Full event details
  category      String         // Category (Technology, Sports, etc.)
  subCategory   String?        // Subcategory (optional)
  date          DateTime       // Date of event
  time          String         // Time as string (e.g., "14:00")
  location      String         // Event location
  hostName      String         // Organization/host name
  contact       String         // Contact phone number
  email         String         // Contact email address
  status        RequestStatus  @default(PENDING)
  createdById   Int            // Who submitted this event
  createdBy     User           @relation(fields: [createdById], references: [id])
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  images        EventImage[]   @relation(onDelete: Cascade)

  // Performance indexes
  @@index([status])                              // Filter by status
  @@index([createdById])                         // Find user's events
  @@index([date])                                // Sort by date
  @@index([category])                            // Filter by category
  // Trigram indexes for text search (defined via migrations)
  // - title, description, location, hostName
}

enum RequestStatus {
  PENDING      // Awaiting admin review
  APPROVED     // Visible to users
  REJECTED     // Hidden from users
}
```

### Indexes & Query Optimization

**Regular Indexes:**

```sql
-- Filter by status (most common query)
SELECT * FROM "EventRequest" 
WHERE status = 'APPROVED'
ORDER BY date DESC;
-- Uses: @@index([status])

-- Find user's submissions
SELECT * FROM "EventRequest"
WHERE "createdById" = 5;
-- Uses: @@index([createdById])

-- Sort by date
SELECT * FROM "EventRequest"
ORDER BY date DESC
LIMIT 20;
-- Uses: @@index([date])
```

**Trigram Index:**

```sql
-- Fuzzy text search (typo-tolerant)
SELECT * FROM "EventRequest"
WHERE title % 'AI Workshop'
OR description % 'AI Workshop'
ORDER BY similarity(title, 'AI Workshop') DESC;
-- Uses: pg_trgm extension with custom migration
-- Benefit: 100x faster text search
```

**Partial Index:**

```sql
-- Only index approved events (saves space)
CREATE INDEX idx_eventrequest_approved 
ON "EventRequest"(status) 
WHERE status = 'APPROVED';
-- Reduces index size by ~40-50%
```

### Storage

```
id | title              | status   | category     | date       | createdById
1  | AI Workshop        | APPROVED | Technology   | 2026-02-15 | 5
2  | Sports Day         | PENDING  | Sports       | 2026-05-10 | 3
3  | Career Fair        | REJECTED | Career       | 2026-03-20 | 7
```

---

## EventImage Model

Stores event images hosted on Cloudinary.

### Schema

```prisma
model EventImage {
  id             Int          @id @default(autoincrement())
  url            String       // Cloudinary CDN URL
  eventRequestId Int          // Which event this belongs to
  eventRequest   EventRequest @relation(
    fields: [eventRequestId], 
    references: [id],
    onDelete: Cascade  // Auto-delete when event deleted
  )

  @@index([eventRequestId])  // Find images for an event
}
```

### Cascade Delete

When an EventRequest is deleted:
```
DELETE FROM "EventRequest" WHERE id = 10
  ↓
Cascade triggers:
  ↓
DELETE FROM "EventImage" WHERE "eventRequestId" = 10
```

**Benefits:**
- No orphaned image records
- Automatic cleanup
- No manual foreign key handling

### Storage

```
id | url                              | eventRequestId
1  | https://cloudinary.com/img1.jpg  | 1
2  | https://cloudinary.com/img2.jpg  | 1
3  | https://cloudinary.com/img3.jpg  | 2
```

**Note**: Images stored on Cloudinary, only URLs in database.

---

## Relationships

### User → EventRequest (One-to-Many)

One user can create many events:

```javascript
// Get all events by user
const userWithEvents = await prisma.user.findUnique({
  where: { id: 5 },
  include: {
    eventRequests: {
      where: { status: 'APPROVED' }
    }
  }
});
// Returns: { id: 5, name: "...", eventRequests: [...] }
```

### EventRequest → EventImage (One-to-Many)

One event can have many images:

```javascript
// Get event with all images
const eventWithImages = await prisma.eventRequest.findUnique({
  where: { id: 1 },
  include: { images: true }
});
// Returns: { id: 1, title: "...", images: [{...}, {...}] }
```

---

## Query Examples

### User Operations

**Get user profile:**
```javascript
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" }
});
```

**Update user:**
```javascript
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: "New Name" }
});
```

### Event Operations

**Get approved events:**
```javascript
const approved = await prisma.eventRequest.findMany({
  where: { status: 'APPROVED' },
  select: {
    id: true,
    title: true,
    date: true,
    images: { select: { url: true } }
  },
  orderBy: { date: 'desc' },
  take: 20
});
```

**Search events (trigram):**
```javascript
// This requires raw SQL (Prisma doesn't support trigram directly)
const results = await prisma.$queryRaw`
  SELECT * FROM "EventRequest"
  WHERE title % 'AI Workshop'
  ORDER BY similarity(title, 'AI Workshop') DESC
  LIMIT 20
`;
```

**Get user's events:**
```javascript
const myEvents = await prisma.eventRequest.findMany({
  where: { createdById: 5 },
  include: { images: true },
  orderBy: { createdAt: 'desc' }
});
```

---

## Database Migrations

All schema changes tracked in migrations:

```
20251125111408_init                    // Initial tables
20251125113240_init                    // Add fields
20251125120115_init_event_request      // Event schema
20251127084423_add_sub_category        // subCategory field
20251130094541_add_event_request_email // email field
20251130094756_feild_updated           // Field corrections
20260330175014_add_event_query_indexes // Basic indexes
20260330191500_add_trigram_and_partial // Trigram + partial indexes
20260330193500_add_event_image_cascade // Cascade delete
```

**Run all migrations:**
```bash
npx prisma migrate deploy
```

**Create new migration:**
```bash
# After editing schema.prisma
npx prisma migrate dev --name <migration_name>
```

---

## Constraints & Validation

### Unique Constraints
- `username`: Cannot have duplicates
- `email`: Both User and EventRequest (for contact)

### Foreign Key Constraints
- `createdById` → `User.id`: User must exist
- `eventRequestId` → `EventRequest.id`: Event must exist

### NOT NULL Constraints
All fields required except:
- `subCategory`: Optional in EventRequest
- `gender`: Optional in User (has default)

---

## Data Types

| Field | Type | Min | Max | Notes |
|-------|------|-----|-----|-------|
| `id` | Integer | 1 | 2^31-1 | Auto-increment |
| `name` | String | - | 255 | UTF-8 text |
| `username` | String | - | 255 | Alphanumeric |
| `email` | String | - | 255 | Valid email |
| `password` | String | 60 | 60 | bcrypt hash |
| `title` | String | - | 255 | Event name |
| `description` | String | - | 5000 | Rich text |
| `date` | DateTime | - | - | ISO 8601 |
| `status` | Enum | - | - | PENDING/APPROVED/REJECTED |
| `url` | String | - | 2048 | Cloudinary CDN URL |

---

## Performance Tuning

**Check query performance:**
```bash
# Enable query logging
SLOW_QUERY_THRESHOLD_MS=100

# Analyze slow queries
tail -f logs | grep SLOW_QUERY
```

**Optimize slow queries:**

| Issue | Solution |
|-------|----------|
| Slow text search | Use trigram index (already applied) |
| Slow status filter | Use regular index (already applied) |
| Slow pagination | Switch to cursor pagination |
| Large result set | Add `take` limit + pagination |

---

## Backup & Recovery

**PostgreSQL backup:**
```bash
pg_dump campus_connect > backup.sql
```

**Restore from backup:**
```bash
psql campus_connect < backup.sql
```

---

See [INSTALLATION.md](./INSTALLATION.md) for database setup.

