# Campus Connect 🎓

A comprehensive mobile application built with React Native (Expo) and Node.js that enables students to discover, host, and manage campus events seamlessly. The platform features role-based access control with separate interfaces for regular users and administrators.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

## ✨ Features

### For Users

- **Authentication & Authorization**: Secure user registration and login with JWT tokens
- **Event Discovery**: Browse and search campus events by category, date, and location
- **Event Hosting**: Submit event requests with images, details, and scheduling
- **My Events**: Track your submitted events and their approval status
- **Event Details**: View comprehensive information about events including images, location, and host details
- **Profile Management**: Edit profile information including name, username, email, and gender
- **Search Functionality**: Search events by title, description, category, or location
- **Event Preview**: Preview events before submitting

### For Admins

- **Event Management**: Approve, reject, or delete event requests
- **User Management**: View all registered users
- **Dashboard**: Monitor all pending, approved, and rejected events
- **Status Updates**: Change event status with a single click

### General Features

- **Responsive Design**: Beautiful UI optimized for mobile devices
- **Dark Mode Support**: Automatic theme switching based on device preferences
- **Image Upload**: Multi-image support for events using Expo Image Picker
- **Real-time Updates**: Live updates on event status changes
- **Role-based Access**: Different features and views for users and admins

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

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/campus_connect.git
cd campus_connect
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run build

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
SERVER_PORT=5001
BACKEND_LOCAL_URL=http://localhost:5001
BACKEND_SERVER_URL=https://your-deployed-backend-url.com

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/campus_connect"

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Node Environment
NODE_ENV=development
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
BACKEND_URL=http://localhost:5001
# For physical device testing, use your local network IP:
# BACKEND_URL=http://192.168.1.XXX:5001
```

## 🏃 Running the Application

### Start the Backend Server

```bash
# In the backend directory
npm run dev     # Development with nodemon
# OR
npm start       # Production mode
```

The backend server will start on `http://localhost:5001`

### Start the Frontend App

```bash
# In the frontend directory
npm start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with Expo Go app on your phone

## 📡 API Documentation

### Base URL

```
http://localhost:5001/api
```

### Authentication Endpoints

| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| POST   | `/user/register` | Register new user   | No            |
| POST   | `/user/login`    | Login user          | No            |
| POST   | `/user/logout`   | Logout user         | Yes           |
| GET    | `/user/me`       | Get current user    | Yes           |
| PUT    | `/user/update`   | Update user profile | Yes           |
| GET    | `/user/`         | Get all users       | No            |

### Event Endpoints

| Method | Endpoint                   | Description                | Auth Required | Admin Only |
| ------ | -------------------------- | -------------------------- | ------------- | ---------- |
| POST   | `/events/request`          | Create event request       | Yes           | No         |
| GET    | `/events/`                 | Get all approved events    | No            | No         |
| GET    | `/events/:id`              | Get event by ID            | No            | No         |
| GET    | `/events/home`             | Get events for home screen | No            | No         |
| GET    | `/events/search`           | Search events              | No            | No         |
| GET    | `/events/me`               | Get my events              | Yes           | No         |
| DELETE | `/events/me/:id`           | Delete my event            | Yes           | No         |
| GET    | `/events/admin`            | Get all events (admin)     | Yes           | Yes        |
| PATCH  | `/events/admin/:id/status` | Update event status        | Yes           | Yes        |
| DELETE | `/events/admin/:id`        | Delete event               | Yes           | Yes        |

### Request/Response Examples

#### Register User

```json
// POST /api/user/register
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "gender": "Male"
}
```

#### Create Event Request

```json
// POST /api/events/request
{
  "title": "Tech Talk: AI in Education",
  "description": "Join us for an insightful session...",
  "category": "Technology",
  "subCategory": "Workshop",
  "date": "2026-02-15T00:00:00.000Z",
  "time": "14:00",
  "location": "Main Auditorium",
  "hostName": "Tech Club",
  "contact": "+1234567890",
  "email": "techclub@campus.edu",
  "images": ["base64_image_data_1", "base64_image_data_2"]
}
```

## 🗄 Database Schema

### User Model

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  username      String         @unique
  email         String         @unique
  password      String
  gender        String         @default("Prefer not to say")
  role          Role           @default(USER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  eventRequests EventRequest[]
}
```

### EventRequest Model

```prisma
model EventRequest {
  id           Int           @id @default(autoincrement())
  title        String
  description  String
  category     String
  subCategory  String?
  date         DateTime
  time         String
  location     String
  hostName     String
  contact      String
  email        String
  status       RequestStatus @default(PENDING)
  createdById  Int
  createdBy    User          @relation(fields: [createdById], references: [id])
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  images       EventImage[]
}
```

### EventImage Model

```prisma
model EventImage {
  id             Int          @id @default(autoincrement())
  url            String
  eventRequestId Int
  eventRequest   EventRequest @relation(fields: [eventRequestId], references: [id])
}
```

### Enums

```prisma
enum Role {
  USER
  ADMIN
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## 📱 Screenshots

> Add screenshots of your application here

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Mayank Sharma**

- GitHub: [@MAYANKSHARMA01010](https://github.com/MAYANKSHARMA01010)

## 🙏 Acknowledgments

- React Native and Expo teams for excellent documentation
- Prisma for the amazing ORM
- React Navigation for seamless navigation
- React Native Paper for beautiful UI components

---

Made with ❤️ for campus communities
