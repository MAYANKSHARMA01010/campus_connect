# Campus Connect 🎓

A production-ready **mobile event management platform** for educational institutions, built with React Native (Expo) and Node.js.

[![GitHub](https://img.shields.io/badge/GitHub-MAYANKSHARMA01010-blue?logo=github)](https://github.com/MAYANKSHARMA01010/campus_connect)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](#version-history)

---

## 🎯 Quick Links

### 📚 Documentation
- **[Installation Guide](./docs/INSTALLATION.md)** - Local setup for backend & frontend
- **[API Reference](./docs/API.md)** - Complete API documentation with examples
- **[Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)** - All configuration options explained
- **[Database Schema](./docs/DATABASE.md)** - Data model & relationships
- **[Production Features](./docs/PRODUCTION_FEATURES.md)** - Caching, optimization, resilience
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to production (Render, Docker, etc.)
- **[Troubleshooting](./docs/CONTRIBUTING.md)** - Common issues & solutions

### 🔗 Project Links
- **GitHub Repository**: https://github.com/MAYANKSHARMA01010/campus_connect
- **Live Backend**: https://campus-connect-asps.onrender.com
- **Author Portfolio**: https://mayank-sharma-personal-portfolio.vercel.app

---

## ✨ Key Features

### 👥 For Users
- **Event Discovery**: Browse, search, and filter campus events
- **Event Hosting**: Submit events for admin approval with images
- **My Events**: Track submitted events and approval status
- **Profile Management**: Update personal information
- **Offline Mode**: Access cached events without internet

### 👨‍💼 For Admins
- **Event Management**: Approve, reject, or delete events
- **User Management**: View all registered users
- **Dashboard**: Monitor pending/approved/rejected events
- **Analytics**: Track event submissions and statistics

### ⚙️ System Features
- **3-Tier Caching**: Redis SWR + In-memory + AsyncStorage (offline)
- **Fast Search**: Trigram indexing for typo-tolerant search
- **Cursor Pagination**: Efficient list loading (always O(1))
- **Circuit Breaker**: Graceful degradation under failure
- **Health Monitoring**: Automated server health checks
- **Slow Query Detection**: Real-time performance monitoring

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native, Expo, React Navigation, React Native Paper |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL + Redis (optional) |
| **Image Upload** | Cloudinary CDN |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcrypt |

---

## 🚀 Getting Started

### For Users (Testing the App)

1. **Download Expo Go** from App Store or Google Play
2. **Scan QR Code** from development server
3. **Create Account** and start exploring events

### For Developers

**Installation & Setup:**
```bash
# Clone repository
git clone https://github.com/MAYANKSHARMA01010/campus_connect.git
cd campus_connect

# Backend setup
cd backend
pnpm install
pnpm build
# Configure .env (see INSTALLATION.md)
pnpm run dev

# Frontend setup (new terminal)
cd frontend
pnpm install
pnpm start
```

**[Detailed Setup Guide →](./docs/INSTALLATION.md)**

---

## 📡 API Overview

**Base URL:**
```
http://localhost:5001/api
```

**Key Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/user/register` | Create account |
| `POST` | `/user/login` | Authenticate |
| `GET` | `/events` | List all events (paginated) |
| `GET` | `/events/search` | Search events (trigram) |
| `GET` | `/events/home` | Home screen (precomputed) |
| `POST` | `/events/request` | Submit event for approval |
| `PATCH` | `/events/admin/:id/status` | Approve/reject (admin) |

**[Complete API Documentation →](./docs/API.md)**

---

## 🗄 Database

**Three main tables:**
1. **Users** - Account information (name, email, password, role)
2. **EventRequests** - Event submissions (title, status, images)
3. **EventImages** - Cloudinary image URLs (cascade delete)

**Optimizations:**
- Trigram indexes for fast text search
- Partial indexes (APPROVED events only)
- Cursor pagination (O(1) performance)
- Cascade deletes for data integrity

**[Database Schema Details →](./docs/DATABASE.md)**

---

## ⚡ Production Features

Campus Connect includes **15+ hardening features** for production:

✅ **Caching**: 3-tier strategy (Redis, in-memory, AsyncStorage)
✅ **Resilience**: Circuit breaker, timeouts, graceful degradation
✅ **Optimization**: Indexes, cursor pagination, payload splitting
✅ **Monitoring**: Slow query detection, health checks, request tracking
✅ **Offline**: Full mobile app functionality without internet
✅ **Security**: JWT auth, bcrypt hashing, CORS protection

**[Learn More About Production Features →](./docs/PRODUCTION_FEATURES.md)**

---

## 🌍 Deployment

**Recommended:**
- **Backend**: Render.com (free tier available)
- **Database**: PostgreSQL on Render
- **Cache**: Redis on Render (optional)
- **Frontend**: Expo EAS Build → App Store/Play Store

**[Step-by-Step Deployment Guide →](./docs/DEPLOYMENT.md)**

---

## 🔧 Configuration

**All features configurable via environment variables:**

```env
# Backend cache TTL (in milliseconds)
CACHE_TTL_EVENTS=45000
CACHE_STALE_EVENTS=90000

# Database protection
DB_TIMEOUT_MS=7000
DB_CIRCUIT_BREAKER_THRESHOLD=5

# Performance monitoring
SLOW_QUERY_THRESHOLD_MS=250

# Optional
REDIS_URL=redis://localhost:6379
ALERT_WEBHOOK_URL=https://your-webhook.com
```

**[Complete Environment Variables Reference →](./docs/ENVIRONMENT_VARIABLES.md)**

---

## 🐛 Troubleshooting

**Common Issues:**

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `pnpm install` |
| Database connection failed | Check PostgreSQL running + DATABASE_URL |
| Redis error | Optional - gracefully falls back to in-memory |
| API connection from mobile | Use local network IP, not localhost |
| Image upload fails | Check Cloudinary credentials in .env |

**[Full Troubleshooting Guide →](./docs/CONTRIBUTING.md)**

---

## 🤝 Contributing

We welcome contributions! 

**How to contribute:**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

**Development Standards:**
- Use async/await (no callbacks)
- Write meaningful commit messages
- Test thoroughly before submitting PR
- Follow existing code patterns

---

## 📊 Project Structure

```
campus_connect/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── server.js       # Entry point
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   └── monitor/        # Health monitoring
│   ├── prisma/             # Database schema
│   └── package.json
│
├── frontend/                # React Native + Expo
│   ├── Screens/            # Application screens
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── api/                # API service layer
│   ├── context/            # State management
│   ├── navigation/         # Navigation setup
│   ├── theme/              # Styling
│   └── package.json
│
├── docs/                    # Documentation
│   ├── INSTALLATION.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── PRODUCTION_FEATURES.md
│   ├── DEPLOYMENT.md
│   ├── TROUBLESHOOTING.md
│   └── CONTRIBUTING.md
│
└── README.md               # This file
```

---

## 👨‍💻 Author

**Mayank Sharma**

| Link | URL |
|------|-----|
| 🌐 Portfolio | https://mayank-sharma-personal-portfolio.vercel.app |
| 📧 Email | sharmamayank01010@gmail.com |
| 🐙 GitHub | https://github.com/MAYANKSHARMA01010 |
| 📱 Project | https://github.com/MAYANKSHARMA01010/campus_connect |

---

## 📄 License

This project is licensed under the **MIT License** - see LICENSE file for details.

**You are free to:**
- Use this code for personal and commercial projects
- Modify and distribute the code
- Use private copies

**You must:**
- Include the original license notice
- Document significant changes

---

## 🙏 Acknowledgments

- React Native & Expo teams for excellent documentation
- Prisma for the amazing ORM experience
- PostgreSQL for powerful database features
- React Navigation for seamless navigation
- React Native Paper for beautiful UI components

---

## 📞 Support

- **Issues**: GitHub Issues
- **Email**: sharmamayank01010@gmail.com
- **Discussions**: GitHub Discussions

---

**Made with ❤️ for campus communities worldwide**

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Mar 31, 2026 | Initial release with production features |
| 0.9.0 | Mar 15, 2026 | Beta testing phase |
| 0.1.0 | Feb 1, 2026 | Initial development |

---

**[Start Here: Installation Guide →](./docs/INSTALLATION.md)**
